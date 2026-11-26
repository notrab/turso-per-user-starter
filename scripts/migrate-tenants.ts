// Applies pending tenant migrations to every user's database.
//
//   npm run db:tenant:migrate             # migrate every ready tenant
//   npm run db:tenant:migrate -- --dry-run
//
// Run it after `npm run db:tenant:generate` and before deploying code that
// needs the new schema. Tenants that fail are reported and left as they were.
import "../envConfig";

import { latestSchemaVersion, migrateTenantDatabase } from "@/lib/tenancy/migrate";
import { getDatabaseProvider } from "@/lib/tenancy/providers";
import {
  listReadyTenants,
  setTenantSchemaVersion,
  tenantDatabase,
  type Tenant,
} from "@/lib/tenancy/registry";

const CONCURRENCY = 5;
const dryRun = process.argv.includes("--dry-run");

async function migrateOne(tenant: Tenant) {
  const provider = getDatabaseProvider(tenant.provider);
  const credentials = await provider.credentials(tenantDatabase(tenant));
  const version = await migrateTenantDatabase(credentials, { attempts: 2 });
  await setTenantSchemaVersion(tenant.userId, version);
}

async function main() {
  const latest = latestSchemaVersion();
  const tenants = (await listReadyTenants()).filter(
    (tenant) => tenant.schemaVersion !== latest,
  );

  console.log(`${tenants.length} tenant database(s) behind ${latest}`);
  if (dryRun || tenants.length === 0) return;

  const failures: { tenant: Tenant; error: unknown }[] = [];
  let done = 0;
  const queue = [...tenants];

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let tenant = queue.shift(); tenant; tenant = queue.shift()) {
        try {
          await migrateOne(tenant);
        } catch (error) {
          failures.push({ tenant, error });
        }
        done++;
        process.stdout.write(`\r${done}/${tenants.length}`);
      }
    }),
  );
  process.stdout.write("\n");

  for (const { tenant, error } of failures) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ ${tenant.dbName} (${tenant.provider}): ${message}`);

    if (tenant.schemaVersion === null) {
      console.error(
        "  This database was created before the registry and may have no migration history.",
      );
    }
  }

  console.log(`Migrated ${tenants.length - failures.length}, failed ${failures.length}`);
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
