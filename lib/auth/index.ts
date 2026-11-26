// Server-side auth for the whole app. Import UI from "@/lib/auth/components"
// and the middleware from "@/lib/auth/middleware".
import { authProviderName } from "./provider";
import { betterAuthAdapter } from "./providers/better-auth/server";
import { clerkAuth } from "./providers/clerk/server";
import type { AuthAdapter } from "./types";

export type { AuthAdapter } from "./types";
export { authProviderName } from "./provider";

const adapters = {
  clerk: clerkAuth,
  "better-auth": betterAuthAdapter,
} satisfies Record<string, AuthAdapter>;

const adapter = () => adapters[authProviderName()];

export const getUserId = () => adapter().getUserId();
export const requireUserId = () => adapter().requireUserId();
