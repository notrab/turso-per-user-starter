import { toNextJsHandler } from "better-auth/next-js";

import { authProviderName } from "@/lib/auth";
import { getAuth } from "@/lib/auth/providers/better-auth/auth";

// Better Auth's API (sign in, sign up, sessions, OAuth callbacks).
// Only active when AUTH_PROVIDER=better-auth.

// Creating the user's database happens during sign-up.
export const maxDuration = 60;

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(request: Request) {
  if (authProviderName() !== "better-auth") return notFound();
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request) {
  if (authProviderName() !== "better-auth") return notFound();
  return toNextJsHandler(getAuth()).POST(request);
}
