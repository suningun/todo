import { decodeAccessToken, request, setAccessToken } from "./client";
import type { Role } from "../types";

export type AuthUser = {
  id?: string;
  email?: string;
  role: Role;
};

export type SignupResult = {
  id: string;
  email: string;
};

export type LoginResult = {
  accessToken: string;
};

export function signup(email: string, password: string): Promise<SignupResult> {
  return request<SignupResult>("/auth/signup", {
    method: "POST",
    body: { email, password },
  });
}

export function login(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function logout(): Promise<void> {
  try {
    await request<void>("/auth/logout", {
      method: "POST",
      auth: true,
      // Logging out must not trigger the refresh/retry flow.
      retryOnUnauthorized: false,
    });
  } finally {
    setAccessToken(null);
  }
}

export function sessionFromToken(token: string, email?: string): AuthUser {
  const claims = decodeAccessToken(token);

  return {
    id: claims.sub,
    email,
    role: claims.role ?? "user",
  };
}
