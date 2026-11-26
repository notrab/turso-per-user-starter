// Auth UI for the configured provider. These are server components that pick
// the provider's implementation, so pages don't need to know which is active.
import type { ReactNode } from "react";

import { authProviderName } from "./provider";
import { githubEnabled } from "./providers/better-auth/config";
import * as betterAuth from "./providers/better-auth/forms";
import { UserMenu as BetterAuthUserMenu } from "./providers/better-auth/user-menu";
import * as clerk from "./providers/clerk/components";
import { UserMenu as ClerkUserMenu } from "./providers/clerk/user-menu";
import type { AuthFormProps, UserMenuProps } from "./types";

export type { UserMenuLink } from "./types";

const isClerk = () => authProviderName() === "clerk";

export function AuthProvider({ children }: { children: ReactNode }) {
  return isClerk() ? (
    <clerk.AuthProvider>{children}</clerk.AuthProvider>
  ) : (
    children
  );
}

export function SignInForm(props: AuthFormProps) {
  return isClerk() ? (
    <clerk.SignInForm {...props} />
  ) : (
    <betterAuth.SignInForm {...props} github={githubEnabled()} />
  );
}

export function SignUpForm(props: AuthFormProps) {
  return isClerk() ? (
    <clerk.SignUpForm {...props} />
  ) : (
    <betterAuth.SignUpForm {...props} github={githubEnabled()} />
  );
}

export function UserMenu(props: UserMenuProps) {
  return isClerk() ? (
    <ClerkUserMenu {...props} />
  ) : (
    <BetterAuthUserMenu {...props} />
  );
}
