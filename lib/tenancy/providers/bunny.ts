import { dumpDatabase } from "../dump";
import type { DatabaseProvider, TenantDatabase } from "../types";

// Bunny Database, through the v3 Database API:
// https://bunny.net/docs/api-reference/database
//
// Unlike Turso, a database's URL includes an ID assigned at creation and every
// database has its own token, so both are stored in the control database.
//
// Bunny doesn't enforce unique names: creating with a name that's taken makes
// a second database. One database per user comes from the registry claim and
// provisionTenant calling find() before create().

type BunnyDatabase = {
  Id: string;
  Name: string;
  Url: string;
};

type ListResponse = {
  Items: BunnyDatabase[];
  HasMoreItems: boolean;
};

export class BunnyApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BunnyApiError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

function regionList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((region) => region.trim().toUpperCase())
    .filter(Boolean);
}

/** Pulls a readable message out of an error response. */
async function errorMessage(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");

  try {
    const body = JSON.parse(text);
    const message = body.detail ?? body.Message ?? body.message ?? body.title;
    if (message) return String(message);
  } catch {
    // Not JSON.
  }

  return text || response.statusText || `HTTP ${response.status}`;
}

const MAX_ATTEMPTS = 4;

export function createBunnyProvider(): DatabaseProvider {
  const apiKey = requireEnv("BUNNYNET_API_KEY");
  const baseUrl = (
    process.env.BUNNY_DATABASE_API_URL || "https://api.bunny.net/database"
  ).replace(/\/$/, "");

  const storageRegion = requireEnv("BUNNY_DB_STORAGE_REGION");
  const primaryRegions = regionList(process.env.BUNNY_DB_PRIMARY_REGIONS);
  const replicaRegions = regionList(process.env.BUNNY_DB_REPLICA_REGIONS);

  if (primaryRegions.length === 0) {
    throw new Error("BUNNY_DB_PRIMARY_REGIONS needs at least one region, e.g. DE");
  }

  // Tokens are stored encrypted, so fail before creating anything if we can't.
  requireEnv("TENANT_TOKEN_ENCRYPTION_KEY");

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    for (let attempt = 1; ; attempt++) {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          AccessKey: apiKey,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });

      if (response.ok) {
        const text = await response.text();
        return (text ? JSON.parse(text) : undefined) as T;
      }

      // Rate limited: wait and retry.
      if (response.status === 429 && attempt < MAX_ATTEMPTS) {
        const retryAfter = Number(response.headers.get("Retry-After"));
        const delay = retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const message = await errorMessage(response);

      if (response.status === 403) {
        throw new BunnyApiError(
          `Bunny refused the request (403): ${message}. If the account is at its database limit, ask bunny.net support to raise it.`,
          403,
        );
      }

      throw new BunnyApiError(
        `Bunny Database API ${method} ${path} failed (${response.status}): ${message}`,
        response.status,
      );
    }
  }

  const getDatabase = async (id: string) =>
    (await request<{ Db: BunnyDatabase }>("GET", `/v3/databases/${encodeURIComponent(id)}`)).Db;

  const generateToken = async (id: string) =>
    (
      await request<{ Token: string }>(
        "PUT",
        `/v3/databases/${encodeURIComponent(id)}/auth/generate`,
        { Authorization: "full-access" },
      )
    ).Token;

  /** Fetches the URL and mints a token for an existing database. */
  const withToken = async (db: BunnyDatabase): Promise<TenantDatabase> => ({
    id: db.Id,
    url: db.Url,
    authToken: await generateToken(db.Id),
  });

  /**
   * The database with exactly this name. The API's search is a substring
   * match, so results are filtered here. If duplicates exist, the oldest wins
   * (IDs are ULIDs, so they sort by creation time), so retries always settle
   * on the same database.
   */
  async function findByName(name: string): Promise<BunnyDatabase | null> {
    const matches: BunnyDatabase[] = [];

    for (let page = 1; ; page++) {
      const params = new URLSearchParams({
        page: String(page),
        perPage: "1000",
        search: name,
      });
      const list = await request<ListResponse>("GET", `/v3/databases?${params}`);

      matches.push(...list.Items.filter((db) => db.Name === name));
      if (!list.HasMoreItems) break;
    }

    if (matches.length > 1) {
      console.warn(`Found ${matches.length} Bunny databases named ${name}; using the oldest`);
    }
    return matches.sort((a, b) => a.Id.localeCompare(b.Id))[0] ?? null;
  }

  async function credentials(db: TenantDatabase) {
    if (!db.authToken) {
      throw new Error(`No stored token for Bunny database ${db.id}`);
    }
    return { url: db.url, authToken: db.authToken };
  }

  return {
    name: "bunny",

    async create(name) {
      const { DbId } = await request<{ DbId: string }>("POST", "/v3/databases", {
        Name: name,
        StorageRegion: storageRegion,
        PrimaryRegions: primaryRegions,
        ReplicasRegions: replicaRegions,
      });

      // Create only returns the ID, so look the database up for its URL.
      // The URL's ID differs from DbId, so it can't be built from it.
      return withToken(await getDatabase(DbId));
    },

    async find(name) {
      const db = await findByName(name);
      return db ? withToken(db) : null;
    },

    credentials,

    // The API has no export endpoint, so read the database over libSQL.
    async dump(db) {
      return dumpDatabase(await credentials(db));
    },
  };
}
