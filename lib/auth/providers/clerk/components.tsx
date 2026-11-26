import { ClerkProvider, SignIn, SignUp } from "@clerk/nextjs";
import type { ReactNode } from "react";

import type { AuthFormProps } from "../../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

export function SignInForm({ redirectTo = "/welcome" }: AuthFormProps) {
  return <SignIn path="/sign-in" fallbackRedirectUrl={redirectTo} />;
}

export function SignUpForm({ redirectTo = "/welcome" }: AuthFormProps) {
  return <SignUp path="/sign-up" fallbackRedirectUrl={redirectTo} />;
}
