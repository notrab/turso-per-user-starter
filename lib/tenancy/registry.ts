import { and, eq, lt, or } from "drizzle-orm";

import { controlDb } from "@/db/control/client";
import { tenants, type Tenant } from "@/db/control/schema";

import { decryptToken } from "./crypto";
import type { TenantDatabase } from "./types";

export type { Tenant };

/** A pending claim older than this is treated as abandoned and can be retried. */
const STALE_CLAIM_SECONDS = 120;

const now = () => Math.floor(Date.now() / 1000);

export async function getTenant(userId: string): Promise<Tenant | null> {
  const row = await controlDb().query.tenants.findFirst({
    where: eq(tenants.userId, userId),
  });
  return row ?? null;
}

export async function listReadyTenants(): Promise<Tenant[]> {
  return controlDb().query.tenants.findMany({
    where: eq(tenants.status, "ready"),
  });
}

/**
 * Claims the right to provision a user's database. Returns the claimed row,
 * or null when another request already holds the claim or the database is ready.
 *
 * A claim succeeds when there's no row yet, the last attempt failed, or a
 * pending attempt has stalled. The database name is kept across retries so a
 * retry can find a database an earlier attempt created.
 */
export async function claimTenant(
  userId: string,
  provider: string,
  dbName: string,
): Promise<Tenant | null> {
  const timestamp = now();

  const [row] = await controlDb()
    .insert(tenants)
    .values({
      userId,
      provider,
      dbName,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: tenants.userId,
      set: { provider, status: "pending", error: null, updatedAt: timestamp },
      setWhere: or(
        eq(tenants.status, "failed"),
        and(
          eq(tenants.status, "pending"),
          lt(tenants.updatedAt, timestamp - STALE_CLAIM_SECONDS),
        ),
      ),
    })
    .returning();

  return row ?? null;
}

export async function markTenantReady(
  userId: string,
  values: Pick<
    Tenant,
    "provider" | "dbName" | "dbId" | "dbUrl" | "authTokenEnc" | "schemaVersion"
  >,
): Promise<Tenant> {
  const [row] = await controlDb()
    .update(tenants)
    .set({ ...values, status: "ready", error: null, updatedAt: now() })
    .where(eq(tenants.userId, userId))
    .returning();
  return row;
}

export async function markTenantFailed(userId: string, error: string) {
  await controlDb()
    .update(tenants)
    .set({ status: "failed", error, updatedAt: now() })
    .where(eq(tenants.userId, userId));
}

export async function setTenantSchemaVersion(
  userId: string,
  schemaVersion: string,
) {
  await controlDb()
    .update(tenants)
    .set({ schemaVersion, updatedAt: now() })
    .where(eq(tenants.userId, userId));
}

/** Where a ready tenant's database lives, with its token decrypted. */
export function tenantDatabase(tenant: Tenant): TenantDatabase {
  if (!tenant.dbId || !tenant.dbUrl) {
    throw new Error(`Tenant ${tenant.userId} has no database yet`);
  }

  return {
    id: tenant.dbId,
    url: tenant.dbUrl,
    authToken: tenant.authTokenEnc
      ? decryptToken(tenant.authTokenEnc)
      : undefined,
  };
}
