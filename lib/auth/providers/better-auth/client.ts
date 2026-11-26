import { createAuthClient } from "better-auth/react";

// Talks to /api/auth on the same origin.
export const authClient = createAuthClient();
