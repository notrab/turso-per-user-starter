import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

const allowedEvents = ["user.created"];

/**
 * Builds a route handler for Clerk's `user.created` webhook.
 * `onUserCreated` returns false when it couldn't finish the work.
 */
export function createUserCreatedWebhook(
  onUserCreated: (userId: string) => Promise<boolean>,
) {
  return async function POST(req: Request) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      throw new Error(
        "Please add CLERK_WEBHOOK_SECRET from the Clerk Dashboard to .env or .env.local",
      );
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    // Verify the raw body. Re-serialising parsed JSON can change the bytes
    // and break the signature check.
    const body = await req.text();

    let evt: WebhookEvent;

    try {
      evt = new Webhook(secret).verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", { status: 400 });
    }

    const { id } = evt.data;

    if (!id) {
      return new Response("No ID found", { status: 400 });
    }

    if (!allowedEvents.includes(evt.type)) {
      return new Response("Event not allowed", { status: 400 });
    }

    try {
      const success = await onUserCreated(id);

      if (!success) {
        return new Response("Error creating database", { status: 500 });
      }
    } catch (err) {
      console.error("Error processing webhook:", err);
      return new Response("Error occurred", { status: 500 });
    }

    return new Response();
  };
}
