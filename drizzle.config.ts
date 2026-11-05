import { defineConfig } from "drizzle-kit";

// Migrations should run against the direct (unpooled) connection — Neon's
// pooled PgBouncer connection runs in transaction mode and doesn't support
// the session-level operations drizzle-kit relies on.
const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!migrationUrl) {
  throw new Error("DATABASE_URL_UNPOOLED (or DATABASE_URL) is not set");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
});
