"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import type { AuthFormProps } from "../../types";
import { authClient } from "./client";
import { AuthCard, Button, Field, FormError } from "./form-ui";

type Props = AuthFormProps & { github?: boolean };

/** Full page load, since /welcome is a route handler, not a page. */
const goTo = (path: string) => window.location.assign(path);

type AuthResult = { error: { message?: string } | null };

const FALLBACK_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR =
  "Couldn't reach the server. Check your connection and try again.";

/**
 * Runs an auth client call and tracks its error and pending state. The client
 * returns most failures as `{ error }`, but throws on network errors, so both
 * are handled. On success it stays pending while the page changes.
 */
function useAuthAction() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(
    action: () => Promise<AuthResult>,
    onSuccess?: () => void,
  ) {
    setPending(true);
    setError(null);

    try {
      const result = await action();
      if (!result.error) {
        onSuccess?.();
        return;
      }
      setError(result.error.message || FALLBACK_ERROR);
    } catch (err) {
      console.error("Auth request failed:", err);
      setError(NETWORK_ERROR);
    }

    setPending(false);
  }

  return { error, pending, run };
}

function GitHubButton({
  redirectTo,
  pending,
  run,
}: {
  redirectTo: string;
  pending: boolean;
  run: ReturnType<typeof useAuthAction>["run"];
}) {
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        // On success the client redirects to GitHub itself.
        onClick={() =>
          run(() =>
            authClient.signIn.social({
              provider: "github",
              callbackURL: redirectTo,
            }),
          )
        }
      >
        Continue with GitHub
      </Button>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-white/40">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </>
  );
}

/** Submit handler that reads the form, then runs the auth call. */
function onFormSubmit(
  run: ReturnType<typeof useAuthAction>["run"],
  action: (form: FormData) => Promise<AuthResult>,
  onSuccess: () => void,
) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    run(() => action(form), onSuccess);
  };
}

export function SignInForm({ redirectTo = "/welcome", github }: Props) {
  const { error, pending, run } = useAuthAction();
  const onSubmit = onFormSubmit(
    run,
    (form) =>
      authClient.signIn.email({
        email: String(form.get("email")),
        password: String(form.get("password")),
      }),
    () => goTo(redirectTo),
  );

  return (
    <AuthCard
      title="Sign in"
      footer={
        <>
          No account yet?{" "}
          <Link href="/sign-up" className="text-aquamarine underline">
            Sign up
          </Link>
        </>
      }
    >
      {github && (
        <GitHubButton redirectTo={redirectTo} pending={pending} run={run} />
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <FormError message={error} />
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export function SignUpForm({ redirectTo = "/welcome", github }: Props) {
  const { error, pending, run } = useAuthAction();
  const onSubmit = onFormSubmit(
    run,
    (form) =>
      authClient.signUp.email({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      }),
    () => goTo(redirectTo),
  );

  return (
    <AuthCard
      title="Create your account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-aquamarine underline">
            Sign in
          </Link>
        </>
      }
    >
      {github && (
        <GitHubButton redirectTo={redirectTo} pending={pending} run={run} />
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          required
          autoFocus
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <FormError message={error} />
        <Button type="submit" disabled={pending}>
          {pending ? "Creating your account…" : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}
