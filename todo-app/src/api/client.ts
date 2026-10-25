const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * The API's protected routes sit behind an API-key guard in addition to the
 * bearer token. Auth routes are public and do not need it, but sending it
 * everywhere is harmless.
 */
const API_KEY: string | undefined = import.meta.env.VITE_API_KEY;

/** Access token kept in memory only — never in localStorage/sessionStorage. */
let accessToken: string | null = null;

/** Shared in-flight refresh so concurrent 401s only rotate the cookie once. */
let refreshPromise: Promise<string | null> | null = null;

let sessionExpiredHandler: (() => void) | null = null;

export type TokenClaims = {
  sub?: string;
  role?: "user" | "admin";
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  /** Auth endpoints must never trigger the refresh-and-retry interceptor. */
  retryOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Registered by the auth provider so a failed refresh can send the UI back to
 * the login screen without the API layer needing to know about React.
 */
export function onSessionExpired(handler: () => void): () => void {
  sessionExpiredHandler = handler;

  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

export function decodeAccessToken(token: string): TokenClaims {
  try {
    const payload = token.split(".")[1];
    if (!payload) return {};

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      Math.ceil(normalized.length / 4) * 4,
      "=",
    );
    const parsed: unknown = JSON.parse(atob(padded));

    if (!parsed || typeof parsed !== "object") return {};

    const { sub, role } = parsed as Record<string, unknown>;

    return {
      sub: typeof sub === "string" ? sub : undefined,
      role: role === "admin" ? "admin" : role === "user" ? "user" : undefined,
    };
  } catch {
    return {};
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessage(body: unknown, response: Response): string {
  if (body && typeof body === "object") {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message) return message;
  }

  if (typeof body === "string" && body) return body;

  return `Request failed: ${response.status} ${response.statusText}`;
}

function isBadApiKey(body: unknown): boolean {
  return (
    !!body &&
    typeof body === "object" &&
    (body as { message?: unknown }).message === "Bad API key"
  );
}

async function send(
  path: string,
  options: RequestOptions,
  token: string | null,
): Promise<Response> {
  const headers: Record<string, string> = {};

  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth && token) headers.Authorization = `Bearer ${token}`;
  if (API_KEY) headers["x-api-key"] = API_KEY;

  return fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "include",
  });
}

/**
 * Exchanges the HttpOnly refresh cookie for a new access token. Concurrent
 * callers share the same request because the backend rotates the cookie on
 * every successful refresh, and reusing an old one revokes the whole session.
 *
 * Returns null for any failure; a 401 here simply means "not logged in".
 */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: API_KEY ? { "x-api-key": API_KEY } : undefined,
        });

        if (!response.ok) return null;

        const body = (await readBody(response)) as
          | { accessToken?: unknown }
          | undefined;

        if (!body || typeof body.accessToken !== "string") return null;

        accessToken = body.accessToken;
        return body.accessToken;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

function expireSession(): void {
  accessToken = null;
  sessionExpiredHandler?.();
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const auth = options.auth ?? false;
  const retryOnUnauthorized = options.retryOnUnauthorized ?? true;

  let response = await send(path, options, accessToken);

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const unauthorizedBody = await readBody(response.clone());

    // A missing/invalid API key is a configuration problem, not a session
    // problem. Refreshing would not fix it and would just log the user out.
    if (isBadApiKey(unauthorizedBody)) {
      throw new ApiError(
        401,
        "Missing or invalid API key. Set VITE_API_KEY for this environment.",
      );
    }

    const token = await refreshAccessToken();

    if (!token) {
      expireSession();
      throw new ApiError(401, "Session expired");
    }

    // Retry the original request exactly once with the refreshed token.
    response = await send(path, options, token);

    if (response.status === 401) {
      const retryBody = await readBody(response.clone());

      if (isBadApiKey(retryBody)) {
        throw new ApiError(
          401,
          "Missing or invalid API key. Set VITE_API_KEY for this environment.",
        );
      }

      expireSession();
      throw new ApiError(401, "Session expired");
    }
  }

  const body = await readBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(body, response));
  }

  return body as T;
}
