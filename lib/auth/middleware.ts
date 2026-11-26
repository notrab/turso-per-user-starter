import { NextResponse } from "next/server";

import { authProviderName } from "./provider";
import { clerkMiddleware } from "./providers/clerk/middleware";

// Clerk needs its middleware to read sessions. Better Auth reads the session
// cookie in each request, and pages call requireUserId(), so nothing is needed.
export const authMiddleware =
  authProviderName() === "clerk"
    ? clerkMiddleware()
    : () => NextResponse.next();
