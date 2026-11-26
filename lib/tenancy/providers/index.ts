import type { DatabaseProvider } from "../types";
import { createLocalProvider } from "./local";
import { createTursoProvider } from "./turso";

const factories: Record<string, () => DatabaseProvider> = {
  turso: createTursoProvider,
  local: createLocalProvider,
};

const instances = new Map<string, DatabaseProvider>();

/**
 * A database provider by name. Defaults to DB_PROVIDER, then turso.
 * Existing databases are opened with the provider recorded in the registry,
 * so changing DB_PROVIDER only affects new users.
 */
export function getDatabaseProvider(
  name: string = process.env.DB_PROVIDER || "turso",
): DatabaseProvider {
  const cached = instances.get(name);
  if (cached) return cached;

  const create = factories[name];

  if (!create) {
    throw new Error(
      `Unknown database provider "${name}". Supported: ${Object.keys(factories).join(", ")}`,
    );
  }

  const provider = create();
  instances.set(name, provider);
  return provider;
}
