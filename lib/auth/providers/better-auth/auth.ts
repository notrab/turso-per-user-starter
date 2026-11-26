import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import * as authSchema from "@/db/control/auth-schema";
import { controlDb } from "@/db/control/client";
import { provisionTenant } from "@/lib/tenancy/provision";

import { githubEnabled } from "./config";

/**
 * Vercel preview deployments are served from their own URLs, while
 * BETTER_AUTH_URL usually points at production. Trust the deployment's own
 * URLs so sign-in works on previews too. Vercel sets these automatically.
 */
function vercelOrigins(): string[] {
  return [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter((host): host is string => Boolean(host))
    .map((host) => `https://${host}`);
}

function createAuth() {
  const github = githubEnabled()
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      }
    : {};

  return betterAuth({
    // Users and sessions live in the control database, next to the registry.
    database: drizzleAdapter(controlDb(), {
      provider: "sqlite",
      schema: authSchema,
      // Sign-up writes the user and their password separately. Without a
      // transaction, a failure between the two leaves a user who can never
      // sign in and whose email can't be used again.
      transaction: true,
    }),
    trustedOrigins: vercelOrigins(),
    emailAndPassword: { enabled: true },
    socialProviders: github,
    databaseHooks: {
      user: {
        create: {
          // Create the user's database as soon as they sign up. If this
          // fails, /welcome retries it, so never block sign-up on it.
          after: async (user) => {
            try {
              await provisionTenant(user.id);
            } catch (error) {
              console.error(
                "Error provisioning database after sign-up:",
                error,
              );
            }
          },
        },
      },
    },
    // Lets server actions set auth cookies. Must be the last plugin.
    plugins: [nextCookies()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

/** The Better Auth instance. Created on first use so builds don't need its env vars. */
export function getAuth() {
  auth ??= createAuth();
  return auth;
}
