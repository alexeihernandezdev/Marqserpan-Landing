import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
});
