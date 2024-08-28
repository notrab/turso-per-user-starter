import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@tursodatabase/api";

import { checkDatabaseExists, getDatabaseName } from "../utils";

const turso = createClient({
  token: process.env.TURSO_API_TOKEN!,
  org: process.env.TURSO_ORG!,
});

export async function GET() {
  auth().protect();

  const databaseExists = await checkDatabaseExists();

  if (databaseExists) {
    return redirect("/dashboard");
  }

  const dbName = getDatabaseName();

  if (!dbName) {
    return redirect("/sign-in");
  }

  try {
    await turso.databases.create(dbName, {
      schema: process.env.TURSO_DATABASE_NAME!,
      group: "default",
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Error occured", {
      status: 500,
    });
  }

  redirect("/dashboard");
}
