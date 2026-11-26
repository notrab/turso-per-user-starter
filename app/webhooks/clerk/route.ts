import { createUserCreatedWebhook } from "@/lib/auth/providers/clerk/webhook";
import { createUserDatabase } from "@/lib/tenancy";

export const POST = createUserCreatedWebhook(createUserDatabase);
