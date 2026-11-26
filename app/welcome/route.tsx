import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth";
import { provisionTenant } from "@/lib/tenancy";

// Creating and migrating a database can take a few seconds.
export const maxDuration = 60;

export async function GET() {
  const userId = await requireUserId();

  const result = await provisionTenant(userId);

  if (result.status === "ready") redirect("/dashboard");

  if (result.status === "failed") {
    return new Response("Error creating database", { status: 500 });
  }

  // Another request (usually the sign-up webhook) is creating it. Check again shortly.
  return new Response(
    `<!doctype html><meta http-equiv="refresh" content="2"><title>Setting up</title><p>Setting up your database…</p>`,
    { status: 202, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
