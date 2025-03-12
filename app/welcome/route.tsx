import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { checkDatabaseExists, createUserDatabase } from "../utils";

export async function GET() {
  const { userId } = auth().protect();

  const databaseExists = await checkDatabaseExists();

  if (databaseExists) {
    return redirect("/dashboard");
  }

  if (!userId) {
    return redirect("/sign-in");
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
