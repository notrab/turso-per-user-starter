import "./envConfig.ts";
import { defineConfig } from "drizzle-kit";

if (!process.env.TURSO_SCHEMA_DATABASE_NAME) {
  throw new Error("TURSO_SCHEMA_DATABASE_NAME is missing");
}

if (!process.env.TURSO_ORG_NAME) {
  throw new Error("TURSO_ORG_NAME is missing");
}

if (!process.env.TURSO_DATABASE_GROUP_AUTH_TOKEN) {
  throw new Error("TURSO_DATABASE_GROUP_AUTH_TOKEN is missing");
}

const url = `libsql://${process.env.TURSO_SCHEMA_DATABASE_NAME}-${process.env.TURSO_ORG_NAME}.turso.io`;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url,
    authToken: process.env.TURSO_DATABASE_GROUP_AUTH_TOKEN,
  },
});
