/** Where a tenant's database lives. */
export type TenantDatabase = {
  /** The provider's own ID for the database. */
  id: string;
  /** libSQL connection URL, e.g. libsql://… */
  url: string;
  /** Per-database token, for providers that issue one (Bunny). */
  authToken?: string;
};

export type DatabaseCredentials = {
  url: string;
  authToken?: string;
};

/**
 * Contract every database provider implements. Providers only manage
 * databases. Users, naming, schemas and the registry live in lib/tenancy.
 */
export interface DatabaseProvider {
  readonly name: string;

  /** Creates a database and returns where it lives. */
  create(name: string): Promise<TenantDatabase>;

  /**
   * Finds an existing database by name, or returns null. Used to recover
   * a database an earlier, interrupted attempt created. Providers with
   * per-database tokens issue a fresh one here.
   */
  find(name: string): Promise<TenantDatabase | null>;

  /** What a libSQL client needs to connect to the database. */
  credentials(db: TenantDatabase): Promise<DatabaseCredentials>;

  /** SQL dump of the database, or null when there's nothing to export. Optional. */
  dump?(db: TenantDatabase): Promise<string | null>;
}
