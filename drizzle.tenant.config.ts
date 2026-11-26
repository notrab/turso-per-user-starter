import { defineConfig } from "drizzle-kit";

// Schema for each user's database. Only used to generate migrations:
// `npm run db:tenant:migrate` applies them to every user's database.
export default defineConfig({
  schema: "./db/tenant/schema.ts",
  out: "./db/tenant/migrations",
  dialect: "sqlite",
});
