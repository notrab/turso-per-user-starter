import { authProviderName } from "@/lib/auth";
import { createUserCreatedWebhook } from "@/lib/auth/providers/clerk/webhook";
import { provisionTenant } from "@/lib/tenancy";

// Creating and migrating a database can take a few seconds.
export const maxDuration = 60;

// "pending" means /welcome is already creating it, which counts as handled.
const handler = createUserCreatedWebhook(
  async (userId) => (await provisionTenant(userId)).status !== "failed",
);

export async function POST(request: Request) {
  if (authProviderName() !== "clerk") {
    return new Response("Not found", { status: 404 });
  }
  return handler(request);
}
