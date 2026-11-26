import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Encrypts per-database tokens before they're stored in the control database.
// TENANT_TOKEN_ENCRYPTION_KEY is 32 random bytes, base64 encoded:
//   openssl rand -base64 32

const ALGORITHM = "aes-256-gcm";
const VERSION = "v1";

function key(): Buffer {
  const value = process.env.TENANT_TOKEN_ENCRYPTION_KEY;

  if (!value) {
    throw new Error(
      "TENANT_TOKEN_ENCRYPTION_KEY is missing. Generate one with `openssl rand -base64 32`.",
    );
  }

  const buffer = Buffer.from(value, "base64");
  if (buffer.length !== 32) {
    throw new Error("TENANT_TOKEN_ENCRYPTION_KEY must be 32 bytes, base64 encoded");
  }
  return buffer;
}

export function encryptToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key(), iv);
  const data = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv, tag, data].map((part) =>
    typeof part === "string" ? part : part.toString("base64url"),
  ).join(".");
}

export function decryptToken(value: string): string {
  const [version, iv, tag, data] = value.split(".");

  if (version !== VERSION || !iv || !tag || !data) {
    throw new Error("Unrecognised encrypted token format");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    key(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(data, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
