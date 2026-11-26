import { createHash } from "node:crypto";
import md5 from "md5";

/**
 * The database name for a user. 16 hex characters (64 bits of SHA-256) fits
 * every provider's limits. Bunny caps names at 16 characters.
 */
export function databaseNameFor(userId: string): string {
  return createHash("sha256").update(userId).digest("hex").slice(0, 16);
}

/** How databases were named before the registry existed (Turso only). */
export function legacyDatabaseNameFor(userId: string): string {
  return md5(userId);
}
