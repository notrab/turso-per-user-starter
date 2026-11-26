import { createClient } from "@tursodatabase/api";

import type { DatabaseProvider, TenantDatabase } from "../types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

// The SDK's TursoClientError (which carries `status`) isn't exported at
// runtime, and responses without a JSON body throw a plain Error instead.
function isNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    (error as Error & { status?: number }).status === 404 ||
    /Status 404\b/.test(error.message)
  );
}

export function createTursoProvider(): DatabaseProvider {
  const turso = createClient({
    token: requireEnv("TURSO_API_TOKEN"),
    org: requireEnv("TURSO_ORG"),
  });
  const group = process.env.TURSO_GROUP || "default";

  const toTenantDatabase = (db: {
    name: string;
    hostname: string;
  }): TenantDatabase => ({ id: db.name, url: `libsql://${db.hostname}` });

  // Every database in the group shares one token, so nothing is stored per database.
  const groupToken = () => requireEnv("TURSO_GROUP_AUTH_TOKEN");

  return {
    name: "turso",

    async create(name) {
      return toTenantDatabase(await turso.databases.create(name, { group }));
    },

    async find(name) {
      try {
        return toTenantDatabase(await turso.databases.get(name));
      } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
      }
    },

    async credentials(db) {
      return { url: db.url, authToken: groupToken() };
    },

    async dump(db) {
      const url = db.url.replace(/^libsql:/, "https:") + "/dump";

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${groupToken()}` },
      });

      return response.ok ? response.text() : null;
    },
  };
}
