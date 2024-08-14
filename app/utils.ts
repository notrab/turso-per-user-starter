import { auth } from "@clerk/nextjs/server";
import { createClient as createLibsqlClient } from "@libsql/client";
import { createClient as createTursoClient } from "@tursodatabase/api";
import md5 from "md5";
import { redirect } from "next/navigation";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "@/db/schema";

const turso = createTursoClient({
  token: process.env.TURSO_USER_API_TOKEN!,
  org: process.env.TURSO_ORG_NAME!,
});

export async function checkDatabaseExists() {
  const dbName = getDatabaseName();
  if (!dbName) return false;

  try {
    await turso.databases.get(dbName);
    return true;
  } catch {
    return false;
  }

  // const url = getHealthcheckEndpoint();

  // if (!url) {
  //   console.error("Failed to check database existence: URL is null.");
  //   return null;
  // }

  // try {
  //   const response = await fetch(url);

  //   return response.status === 200;
  // } catch (error) {
  //   console.error("Failed to check database existence:", error);
  //   return false;
  // }
}

export async function getDatabaseClient() {
  const url = getLibsqlUrl();

  if (!url) {
    console.error("Failed to create database client: URL is null.");
    return redirect("/welcome");
  }

  try {
    return drizzle(
      createLibsqlClient({
        url,
        authToken: process.env.TURSO_DATABASE_GROUP_AUTH_TOKEN,
      }),
      { schema },
    );
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

export function getDatabaseName() {
  const userId = auth().userId;

  if (!userId) return null;

  return md5(userId);
}

function getDatabaseUrl() {
  const dbName = getDatabaseName();
  return dbName ? `${dbName}-${process.env.TURSO_ORG_NAME}.turso.io` : null;
}

// function getHealthcheckEndpoint() {
//   const url = getDatabaseUrl();
//   return url ? `https://${url}/health` : null;
// }

function getLibsqlUrl() {
  const url = getDatabaseUrl();
  return url ? `libsql://${url}` : null;
}

export function getDumpUrl() {
  const url = getDatabaseUrl();
  return url ? `https://${url}/dump` : null;
}
