import "./envConfig";

import { defineConfig } from "drizzle-kit";

if (!process.env.TURSO_DATABASE_NAME) {
  throw new Error("TURSO_DATABASE_NAME is missing");
}

if (!process.env.TURSO_ORG) {
  throw new Error("TURSO_ORG is missing");
}

if (!process.env.TURSO_GROUP_AUTH_TOKEN) {
  throw new Error("TURSO_GROUP_AUTH_TOKEN is missing");
}

const url = `libsql://${process.env.TURSO_DATABASE_NAME}-${process.env.TURSO_ORG}.turso.io`;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
  },
});
