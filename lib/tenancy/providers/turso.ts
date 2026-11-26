import { createClient } from "@tursodatabase/api";

import type { DatabaseProvider, TenantDatabase } from "../types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

export function createTursoProvider(): DatabaseProvider {
  const org = requireEnv("TURSO_ORG");
  const turso = createClient({ token: requireEnv("TURSO_API_TOKEN"), org });

  const locate = (name: string): TenantDatabase => ({
    id: name,
    url: `libsql://${name}-${org}.turso.io`,
  });

  return {
    name: "turso",

    locate,

    async create(name) {
      await turso.databases.create(name, {
        group: "default",
        seed: {
          type: "database",
          name: requireEnv("TURSO_DATABASE_NAME"),
        },
      });

      return locate(name);
    },

    async exists(db) {
      try {
        await turso.databases.get(db.id);
        return true;
      } catch (error) {
        console.error("Error checking database existence:", error);
        return false;
      }
    },

    // Every database in the group shares one token.
    async credentials(db) {
      return { url: db.url, authToken: process.env.TURSO_GROUP_AUTH_TOKEN };
    },

    async dump(db) {
      const url = db.url.replace(/^libsql:/, "https:") + "/dump";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.TURSO_GROUP_AUTH_TOKEN}`,
        },
      });

      return response.ok ? response.text() : null;
    },
  };
}
