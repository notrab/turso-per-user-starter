// App-facing helpers for the signed-in user's database.
// Scripts should import from ./provision, ./registry and ./migrate directly,
// since this file depends on Next.js and the auth provider.
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { redirect } from "next/navigation";

import * as schema from "@/db/tenant/schema";
import { getUserId } from "@/lib/auth";

import { getDatabaseProvider } from "./providers";
import { getTenant, tenantDatabase, type Tenant } from "./registry";

export { provisionTenant, type ProvisionResult } from "./provision";
export type { DatabaseProvider, TenantDatabase } from "./types";

/** The signed-in user's tenant, if their database is ready. */
async function getCurrentTenant(): Promise<Tenant | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const tenant = await getTenant(userId);
  return tenant?.status === "ready" ? tenant : null;
}

export async function hasReadyDatabase(): Promise<boolean> {
  return Boolean(await getCurrentTenant());
}

export async function getDatabaseClient() {
  const tenant = await getCurrentTenant();

  if (!tenant) return redirect("/welcome");

  try {
    const credentials = await getDatabaseProvider(tenant.provider).credentials(
      tenantDatabase(tenant),
    );
    return drizzle(createClient(credentials), { schema });
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

export type DumpResult =
  | { status: "ok"; sql: string | null }
  | { status: "unsupported" };

/** SQL dump of the signed-in user's database. `sql` is null when there's nothing to export. */
export async function dumpUserDatabase(): Promise<DumpResult> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { status: "ok", sql: null };

  const provider = getDatabaseProvider(tenant.provider);
  if (!provider.dump) return { status: "unsupported" };

  return { status: "ok", sql: await provider.dump(tenantDatabase(tenant)) };
}
