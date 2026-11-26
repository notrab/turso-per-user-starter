/** Where a tenant's database lives. */
export type TenantDatabase = {
  /** The provider's own ID for the database. */
  id: string;
  /** libSQL connection URL, e.g. libsql://… */
  url: string;
};

export type DatabaseCredentials = {
  url: string;
  authToken?: string;
};

export type ProvisionedDatabase = TenantDatabase & {
  /** Set by providers that issue a token per database (Bunny). */
  authToken?: string;
};

/**
 * Contract every database provider implements. Providers only manage
 * databases. Schemas, naming and users are handled by lib/tenancy.
 */
export interface DatabaseProvider {
  readonly name: string;

  /** Creates a database and returns where it lives. */
  create(name: string): Promise<ProvisionedDatabase>;

  /** Whether the database still exists at the provider. */
  exists(db: TenantDatabase): Promise<boolean>;

  /** What a libSQL client needs to connect to the database. */
  credentials(db: TenantDatabase): Promise<DatabaseCredentials>;

  /** SQL dump of the database, or null when there's nothing to export. Optional. */
  dump?(db: TenantDatabase): Promise<string | null>;

  /**
   * Works out where a database lives from its name, without an API call.
   * Only providers with predictable URLs (Turso) can do this. The tenant
   * registry replaces it in phase 2.
   */
  locate(name: string): TenantDatabase;
}
