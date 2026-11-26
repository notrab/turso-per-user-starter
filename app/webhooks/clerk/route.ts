import { createUserCreatedWebhook } from "@/lib/auth/providers/clerk/webhook";
import { provisionTenant } from "@/lib/tenancy";

// Creating and migrating a database can take a few seconds.
export const maxDuration = 60;

// "pending" means /welcome is already creating it, which counts as handled.
export const POST = createUserCreatedWebhook(
  async (userId) => (await provisionTenant(userId)).status !== "failed",
);
