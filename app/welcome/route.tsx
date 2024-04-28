import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@tursodatabase/api";

import { checkDatabaseExists, getDatabaseName } from "../utils";

const turso = createClient({
  token: process.env.TURSO_USER_API_TOKEN!,
  org: process.env.TURSO_ORG_NAME!,
});

export async function GET() {
  auth().protect();

  const databaseExists = await checkDatabaseExists();

  console.log("existing db?", databaseExists);

  if (databaseExists) {
    return redirect("/dashboard");
  }

  const dbName = getDatabaseName();

  if (!dbName) {
    return redirect("/sign-in");
  }

  try {
    await turso.databases.create(dbName, {
      schema: process.env.TURSO_SCHEMA_DATABASE_NAME!,
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
