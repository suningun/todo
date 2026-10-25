import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ApiError,
  onSessionExpired,
  refreshAccessToken,
  setAccessToken,
} from "../api/client";
import {
  login as loginRequest,
  logout as logoutRequest,
  sessionFromToken,
  signup as signupRequest,
  type AuthUser,
} from "../api/auth";
import { AuthContext, type AuthStatus } from "./context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const started = useRef(false);

  // Recover a returning user's session from the HttpOnly refresh cookie. A
  // 401 here just means "guest" and is never surfaced as an error.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void refreshAccessToken().then((token) => {
      if (!token) {
        setUser(null);
        setStatus("guest");
        return;
      }

      setUser(sessionFromToken(token));
      setStatus("authenticated");
    });
  }, []);

  // The request layer calls this when a refresh can no longer recover the
  // session, so the UI falls back to the login screen.
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null);
        setStatus("guest");
      }),
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken } = await loginRequest(email, password);

    setAccessToken(accessToken);
    setUser(sessionFromToken(accessToken, email));
    setStatus("authenticated");
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await signupRequest(email, password);

    // Signup does not issue tokens; log in with the same credentials so the
    // new account lands directly on the dashboard.
    const { accessToken } = await loginRequest(email, password);

    setAccessToken(accessToken);
    setUser(sessionFromToken(accessToken, email));
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (err) {
      // A stale access token makes logout itself return 401. Refresh once and
      // retry so the server-side refresh cookie is actually cleared; otherwise
      // a reload would silently sign the user back in.
      if (err instanceof ApiError && err.status === 401) {
        const token = await refreshAccessToken();

        if (token) {
          try {
            await logoutRequest();
          } catch {
            // Give up on the server call; local state is cleared below.
          }
        }
      }
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
