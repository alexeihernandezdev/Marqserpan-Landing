import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { configureLocalNeon } from "./neon-local";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | undefined;

function getDb(): Database {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL no está definida. Copia .env.example a .env.local.");
    }
    configureLocalNeon(url);
    instance = drizzle(neon(url), { schema });
  }
  return instance;
}

// Se conecta en el primer uso, así importar el módulo no exige la variable.
export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
