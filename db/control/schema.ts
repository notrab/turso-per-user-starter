import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * One row per user, recording where their database lives.
 * This is the source of truth for the user's database, not the provider's API.
 */
export const tenants = sqliteTable("tenants", {
  userId: text("user_id").primaryKey(),
  /** The provider the database was created with (turso, bunny, …). */
  provider: text("provider").notNull(),
  dbName: text("db_name").notNull(),
  /** The provider's ID for the database. Set once it's ready. */
  dbId: text("db_id"),
  dbUrl: text("db_url"),
  /** Per-database token, encrypted. Null for providers with a shared token. */
  authTokenEnc: text("auth_token_enc"),
  status: text("status", { enum: ["pending", "ready", "failed"] }).notNull(),
  error: text("error"),
  /** Tag of the last tenant migration applied. Null if unknown. */
  schemaVersion: text("schema_version"),
  /** Unix seconds. */
  createdAt: integer("created_at").notNull(),
  /** Unix seconds. Used to spot provisioning attempts that stalled. */
  updatedAt: integer("updated_at").notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
