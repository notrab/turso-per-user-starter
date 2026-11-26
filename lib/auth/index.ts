// Server-side auth for the whole app. Import UI from "@/lib/auth/components"
// and the middleware from "@/lib/auth/middleware".
//
// Clerk is the only provider so far. When a second one lands, choose it here
// with AUTH_PROVIDER.
import { clerkAuth } from "./providers/clerk/server";

export type { AuthAdapter } from "./types";

export const getUserId = () => clerkAuth.getUserId();
export const requireUserId = () => clerkAuth.requireUserId();
