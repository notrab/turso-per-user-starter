import { encryptToken } from "./crypto";
import { migrateTenantDatabase } from "./migrate";
import { databaseNameFor, legacyDatabaseNameFor } from "./naming";
import { getDatabaseProvider } from "./providers";
import {
  claimTenant,
  getTenant,
  markTenantFailed,
  markTenantReady,
  type Tenant,
} from "./registry";
import type { DatabaseProvider, TenantDatabase } from "./types";

export type ProvisionResult =
  | { status: "ready"; tenant: Tenant }
  /** Another request is creating the database right now. */
  | { status: "pending" }
  | { status: "failed"; error: string };

function fromRow(row: Tenant | null): ProvisionResult {
  if (row?.status === "ready") return { status: "ready", tenant: row };
  if (row?.status === "failed") {
    return { status: "failed", error: row.error ?? "Unknown error" };
  }
  return { status: "pending" };
}

/**
 * Makes sure a user has a database, creating and migrating it if needed.
 *
 * Safe to call from several places at once (the auth provider's sign-up hook
 * and /welcome): only the caller holding the registry claim does the work.
 */
export async function provisionTenant(userId: string): Promise<ProvisionResult> {
  const existing = await getTenant(userId);
  if (existing?.status === "ready") return fromRow(existing);

  const provider = getDatabaseProvider();
  const claim = await claimTenant(userId, provider.name, databaseNameFor(userId));

  if (!claim) return fromRow(await getTenant(userId));

  try {
    const legacy = await findLegacyDatabase(provider, userId);

    if (legacy) {
      // Created before the registry, from a seed rather than migrations, so it
      // may have no migration history. Don't migrate it here.
      return {
        status: "ready",
        tenant: await markTenantReady(userId, {
          ...toRegistryValues(legacy.name, legacy.db),
          schemaVersion: null,
        }),
      };
    }

    // An earlier attempt may have created the database before failing.
    const db =
      (await provider.find(claim.dbName)) ??
      (await provider.create(claim.dbName));

    const schemaVersion = await migrateTenantDatabase(
      await provider.credentials(db),
    );

    return {
      status: "ready",
      tenant: await markTenantReady(userId, {
        ...toRegistryValues(claim.dbName, db),
        schemaVersion,
      }),
    };
  } catch (err) {
    console.error("Error provisioning tenant database:", err);
    const message = err instanceof Error ? err.message : String(err);
    await markTenantFailed(userId, message);
    return { status: "failed", error: message };
  }
}

async function findLegacyDatabase(provider: DatabaseProvider, userId: string) {
  if (provider.name !== "turso") return null;

  const name = legacyDatabaseNameFor(userId);
  const db = await provider.find(name);
  return db ? { name, db } : null;
}

function toRegistryValues(dbName: string, db: TenantDatabase) {
  return {
    dbName,
    dbId: db.id,
    dbUrl: db.url,
    authTokenEnc: db.authToken ? encryptToken(db.authToken) : null,
  };
}
