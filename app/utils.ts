import { auth, type User } from "@clerk/nextjs/server";
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

export async function checkDatabaseExists(dbName: string): Promise<boolean> {
  if (!dbName) return false;

  try {
    await turso.databases.get(dbName);
    return true;
  } catch (error) {
    console.error("Error checking database existence:", error);
    return false;
  }
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

export function getDatabaseName(): string | null {
  const userId = auth().userId;
  return userId ? md5(userId) : null;
}

function getDatabaseUrl(dbName: string | null): string | null {
  return dbName ? `${dbName}-${process.env.TURSO_ORG_NAME}.turso.io` : null;
}

function getLibsqlUrl(): string | null {
  const dbName = getDatabaseName();
  const url = getDatabaseUrl(dbName);
  return url ? `libsql://${url}` : null;
}

export function getDumpUrl(): string | null {
  const dbName = getDatabaseName();
  const url = getDatabaseUrl(dbName);
  return url ? `https://${url}/dump` : null;
}
