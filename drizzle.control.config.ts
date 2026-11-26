import "./envConfig";

import { defineConfig } from "drizzle-kit";

if (!process.env.CONTROL_DATABASE_URL) {
  throw new Error("CONTROL_DATABASE_URL is missing");
}

// The control database records which database belongs to which user.
export default defineConfig({
  schema: "./db/control/schema.ts",
  out: "./db/control/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.CONTROL_DATABASE_URL,
    authToken: process.env.CONTROL_DATABASE_AUTH_TOKEN,
  },
});
