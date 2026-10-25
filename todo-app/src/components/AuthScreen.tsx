import { useState } from "react";
import type { FormEvent } from "react";
import { ListTodo } from "lucide-react";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/context";

type Mode = "login" | "signup";

function authErrorMessage(err: unknown, mode: Mode): string {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return mode === "login"
        ? "Invalid credentials"
        : "Your account was created, but signing in failed. Please sign in.";
    }

    if (err.status === 409) return "That email is already registered.";
    return err.message;
  }

  return "Unable to reach the server. Check that the API is running and try again.";
}

function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (mode === "signup" && (password.length < 8 || password.length > 72)) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(trimmedEmail, password);
      } else {
        await signUp(trimmedEmail, password);
      }
    } catch (err) {
      setError(authErrorMessage(err, mode));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 px-4 py-10 text-stone-800 dark:bg-[#0b0b0f] dark:text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-600/10" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/25">
            <ListTodo className="h-5 w-5" />
          </span>
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            TaskFlow
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xl shadow-stone-900/5 sm:p-8 dark:border-white/10 dark:bg-[#121217] dark:shadow-black/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-stone-500 dark:text-white/45">
              {isSignup
                ? "Start organising your tasks in a few seconds."
                : "Sign in to pick up where you left off."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-white/40"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/30 dark:focus:border-violet-500/60"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-white/40"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isSignup ? "8–72 characters" : "Your password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/30 dark:focus:border-violet-500/60"
              />
              {isSignup && (
                <p className="mt-1.5 text-xs text-stone-400 dark:text-white/35">
                  Use at least 8 characters.
                </p>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isSignup
                  ? "Creating account…"
                  : "Signing in…"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-5 border-t border-stone-200/80 pt-5 text-center text-sm text-stone-500 dark:border-white/5 dark:text-white/45">
            {isSignup ? "Already have an account?" : "New to TaskFlow?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              className="font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-300 dark:hover:text-violet-200"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-stone-400 dark:text-white/30">
          Your session is kept in memory and renewed with a secure cookie.
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
