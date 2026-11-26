import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { dumpDatabase } from "../dump";
import type { DatabaseProvider, TenantDatabase } from "../types";

// Local SQLite files, for development without a cloud account.
// Set DB_PROVIDER=local. Files go in LOCAL_TENANT_DIR (default .tenants/).
export function createLocalProvider(): DatabaseProvider {
  const dir = path.resolve(process.env.LOCAL_TENANT_DIR || ".tenants");

  const fileFor = (name: string) => path.join(dir, `${name}.db`);
  const toTenantDatabase = (name: string): TenantDatabase => ({
    id: name,
    url: `file:${fileFor(name)}`,
  });

  return {
    name: "local",

    async create(name) {
      mkdirSync(dir, { recursive: true });
      // libSQL creates the file on first connection.
      return toTenantDatabase(name);
    },

    async find(name) {
      return existsSync(fileFor(name)) ? toTenantDatabase(name) : null;
    },

    async credentials(db) {
      return { url: db.url };
    },

    async dump(db) {
      return dumpDatabase({ url: db.url });
    },
  };
}
