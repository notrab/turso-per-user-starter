import type { DatabaseProvider } from "../types";
import { createTursoProvider } from "./turso";

const providers: Record<string, () => DatabaseProvider> = {
  turso: createTursoProvider,
};

let provider: DatabaseProvider | undefined;

/** The provider named by DB_PROVIDER. Defaults to turso. */
export function getDatabaseProvider(): DatabaseProvider {
  if (provider) return provider;

  const name = process.env.DB_PROVIDER || "turso";
  const create = providers[name];

  if (!create) {
    throw new Error(
      `Unknown DB_PROVIDER "${name}". Supported: ${Object.keys(providers).join(", ")}`,
    );
  }

  provider = create();
  return provider;
}
