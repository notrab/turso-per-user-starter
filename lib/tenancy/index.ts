import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import md5 from "md5";
import { redirect } from "next/navigation";

import * as schema from "@/db/schema";
import { getUserId } from "@/lib/auth";

import { getDatabaseProvider } from "./providers";
import type { TenantDatabase } from "./types";

export type { DatabaseProvider, TenantDatabase } from "./types";

/** The database name for a user. */
export function databaseNameFor(userId: string): string {
  return md5(userId);
}

/** Where the signed-in user's database lives, or null when signed out. */
async function getUserDatabase(): Promise<TenantDatabase | null> {
  const userId = await getUserId();
  if (!userId) return null;

  return getDatabaseProvider().locate(databaseNameFor(userId));
}

export async function checkDatabaseExists(): Promise<boolean> {
  const db = await getUserDatabase();
  if (!db) return false;

  return getDatabaseProvider().exists(db);
}

export async function getDatabaseClient() {
  const db = await getUserDatabase();

  if (!db) {
    console.error("Failed to create database client: no user database.");
    return redirect("/welcome");
  }

  try {
    const credentials = await getDatabaseProvider().credentials(db);
    return drizzle(createClient(credentials), { schema });
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

export async function createUserDatabase(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    await getDatabaseProvider().create(databaseNameFor(userId));
    return true;
  } catch (err) {
    console.error("Error creating user database:", err);
    return false;
  }
}

/** Whether the configured provider can export a database. */
export function canDumpDatabases(): boolean {
  return Boolean(getDatabaseProvider().dump);
}

/** SQL dump of the signed-in user's database, or null when there's nothing to export. */
export async function dumpUserDatabase(): Promise<string | null> {
  const provider = getDatabaseProvider();
  const db = await getUserDatabase();
  if (!db || !provider.dump) return null;

  return provider.dump(db);
}
