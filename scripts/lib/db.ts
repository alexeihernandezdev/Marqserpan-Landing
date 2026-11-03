import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { configureLocalNeon } from "../../lib/db/neon-local";
import * as schema from "../../lib/db/schema";

/** Conexión para scripts de consola (fuera de Next, sin "server-only"). */
export function connect(envFile = process.env.DOTENV_CONFIG_PATH ?? ".env.local") {
  config({ path: envFile, quiet: true });
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(`DATABASE_URL no está definida en ${envFile}.`);
  }
  configureLocalNeon(url);
  return drizzle(neon(url), { schema });
}

export type ScriptDb = ReturnType<typeof connect>;
