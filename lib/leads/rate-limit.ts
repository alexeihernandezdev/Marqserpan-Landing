import "server-only";
import { createHash } from "node:crypto";
import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** La IP nunca se guarda en claro: solo su hash con el secreto del sitio. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${env().SESSION_SECRET}:${ip}`).digest("hex");
}

/** Más de 5 solicitudes desde la misma IP en 10 minutos. */
export async function isRateLimited(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const [row] = await db
    .select({ total: count() })
    .from(leads)
    .where(and(eq(leads.ipHash, ipHash), gte(leads.createdAt, since)));
  return (row?.total ?? 0) >= MAX_PER_WINDOW;
}
