import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as authSchema from "./auth-schema";
import * as registrySchema from "./schema";

const schema = { ...registrySchema, ...authSchema };

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

/**
 * The control database: the tenant registry and, with Better Auth, its users
 * and sessions. Created on first use, so builds don't need CONTROL_DATABASE_URL.
 */
export function controlDb() {
  if (db) return db;

  const url = process.env.CONTROL_DATABASE_URL;
  if (!url) throw new Error("CONTROL_DATABASE_URL is missing");

  db = drizzle(
    createClient({ url, authToken: process.env.CONTROL_DATABASE_AUTH_TOKEN }),
    { schema },
  );
  return db;
}
