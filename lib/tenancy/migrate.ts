import { readFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import type { DatabaseCredentials } from "./types";

const migrationsFolder = path.join(process.cwd(), "db/tenant/migrations");

/** Tag of the newest tenant migration, e.g. "0000_nappy_cammi". */
export function latestSchemaVersion(): string {
  const journal = JSON.parse(
    readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8"),
  ) as { entries: { tag: string }[] };

  const latest = journal.entries.at(-1);
  if (!latest) throw new Error("No tenant migrations found");
  return latest.tag;
}

/**
 * Applies any pending tenant migrations to one database and returns the
 * schema version it's now on. Safe to run again: applied migrations are skipped.
 *
 * A database that was only just created can take a moment to accept
 * connections, so failures are retried with backoff.
 */
export async function migrateTenantDatabase(
  credentials: DatabaseCredentials,
  { attempts = 5 }: { attempts?: number } = {},
): Promise<string> {
  const client = createClient(credentials);

  try {
    for (let attempt = 1; ; attempt++) {
      try {
        await migrate(drizzle(client), { migrationsFolder });
        return latestSchemaVersion();
      } catch (error) {
        if (attempt >= attempts) throw error;
        await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
      }
    }
  } finally {
    client.close();
  }
}
