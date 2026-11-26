import type { ReactNode } from "react";

/**
 * Server-side contract every auth provider implements.
 * The rest of the app only talks to auth through this.
 */
export interface AuthAdapter {
  /** The signed-in user's ID, or null when signed out. */
  getUserId(): Promise<string | null>;
  /** The signed-in user's ID. Sends signed-out visitors to sign in. */
  requireUserId(): Promise<string>;
}

/** Props the sign-in and sign-up components accept, whatever the provider. */
export type AuthFormProps = {
  /** Where to send the user once they're signed in. */
  redirectTo?: string;
};

export type UserMenuLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type UserMenuProps = {
  /** Extra links shown in the user menu. */
  links?: UserMenuLink[];
};
