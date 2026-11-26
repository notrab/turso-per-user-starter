import { readFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";

import type { DatabaseCredentials } from "./types";

const migrationsFolder = path.join(process.cwd(), "db/tenant/migrations");

/** Drizzle's migration history table. */
const MIGRATIONS_TABLE = "__drizzle_migrations";

/**
 * The last migration that databases created before the registry already
 * contain. They were copied from a template with the `todos` table but
 * usually no migration history.
 */
const LEGACY_BASELINE_TAG = "0000_nappy_cammi";

function journalTags(): string[] {
  const journal = JSON.parse(
    readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8"),
  ) as { entries: { tag: string }[] };
  return journal.entries.map((entry) => entry.tag);
}

/** Tag of the newest tenant migration, e.g. "0000_nappy_cammi". */
export function latestSchemaVersion(): string {
  const latest = journalTags().at(-1);
  if (!latest) throw new Error("No tenant migrations found");
  return latest;
}

/**
 * Records the migrations a pre-registry database already contains, so later
 * migrations apply on top instead of replaying them and failing with "table
 * already exists". Does nothing if the database already has migration history
 * or has no `todos` table. Returns whether it recorded a baseline.
 */
export async function baselineLegacyDatabase(
  credentials: DatabaseCredentials,
): Promise<boolean> {
  const client = createClient(credentials);

  const tableExists = async (name: string) =>
    (
      await client.execute({
        sql: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
        args: [name],
      })
    ).rows.length > 0;

  try {
    if (await tableExists(MIGRATIONS_TABLE)) {
      const history = await client.execute(
        `SELECT 1 FROM "${MIGRATIONS_TABLE}" LIMIT 1`,
      );
      if (history.rows.length > 0) return false;
    }

    if (!(await tableExists("todos"))) return false;

    const baselineIndex = journalTags().indexOf(LEGACY_BASELINE_TAG);
    if (baselineIndex === -1) {
      throw new Error(`Baseline migration ${LEGACY_BASELINE_TAG} not found`);
    }

    // readMigrationFiles returns migrations in journal order, with the hash
    // and timestamp the migrator compares against.
    const applied = readMigrationFiles({ migrationsFolder }).slice(
      0,
      baselineIndex + 1,
    );

    await client.batch(
      [
        // The same table the migrator creates.
        `CREATE TABLE IF NOT EXISTS "${MIGRATIONS_TABLE}" (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL,
          created_at numeric
        )`,
        ...applied.map((migration) => ({
          sql: `INSERT INTO "${MIGRATIONS_TABLE}" ("hash", "created_at") VALUES (?, ?)`,
          args: [migration.hash, migration.folderMillis],
        })),
      ],
      "write",
    );

    return true;
  } finally {
    client.close();
  }
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
