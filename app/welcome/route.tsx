import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth";
import { checkDatabaseExists, createUserDatabase } from "@/lib/tenancy";

export async function GET() {
  const userId = await requireUserId();

  const databaseExists = await checkDatabaseExists();

  if (databaseExists) {
    return redirect("/dashboard");
  }

  try {
    const success = await createUserDatabase(userId);

    if (!success) {
      return new Response("Error creating database", {
        status: 500,
      });
    }
  } catch (err) {
    console.error("Error creating database:", err);
    return new Response("Error occurred", {
      status: 500,
    });
  }

  redirect("/dashboard");
}
