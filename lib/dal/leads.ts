import "server-only";
import { and, count, desc, eq, gte, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { buildWeeklyStats, type WeeklyRow } from "@/lib/leads/stats";
import type { LeadStatus, LeadType } from "@/lib/validation/lead-constants";
import { verifySession } from "./session";

export const LEADS_PAGE_SIZE = 25;

export type LeadFilters = { status?: LeadStatus; type?: LeadType; source?: string; page?: number };

export async function listLeads(filters: LeadFilters) {
  await verifySession();
  const conditions: SQL[] = [];
  if (filters.status) conditions.push(eq(leads.status, filters.status));
  if (filters.type) conditions.push(eq(leads.type, filters.type));
  if (filters.source) conditions.push(eq(leads.source, filters.source));
  const where = conditions.length ? and(...conditions) : undefined;
  const page = Math.max(1, filters.page ?? 1);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: leads.id,
        type: leads.type,
        name: leads.name,
        city: leads.city,
        country: leads.country,
        source: leads.source,
        status: leads.status,
        productName: leads.productName,
        notificationStatus: leads.notificationStatus,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(LEADS_PAGE_SIZE)
      .offset((page - 1) * LEADS_PAGE_SIZE),
    db.select({ total: count() }).from(leads).where(where),
  ]);

  return { rows, total, page, pages: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)) };
}

export async function listLeadSources(): Promise<string[]> {
  await verifySession();
  const rows = await db.selectDistinct({ source: leads.source }).from(leads).orderBy(leads.source);
  return rows.map((r) => r.source);
}

export async function getLead(id: string) {
  await verifySession();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  return lead ?? null;
}

export async function countNewLeads(): Promise<number> {
  await verifySession();
  const [row] = await db.select({ total: count() }).from(leads).where(eq(leads.status, "nueva"));
  return row?.total ?? 0;
}

export async function getLeadStats({ weeks = 12 } = {}) {
  await verifySession();
  const since = new Date(Date.now() - (weeks + 1) * 7 * 24 * 60 * 60 * 1000);
  const week = sql<string>`to_char(date_trunc('week', ${leads.createdAt} at time zone 'America/Caracas'), 'YYYY-MM-DD')`;
  const rows = await db
    .select({ week, source: leads.source, total: count() })
    .from(leads)
    .where(gte(leads.createdAt, since))
    .groupBy(week, leads.source);
  return buildWeeklyStats(rows as WeeklyRow[], weeks);
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await verifySession();
  await db
    .update(leads)
    .set({ status, attendedAt: status === "atendida" ? new Date() : null })
    .where(eq(leads.id, id));
}

export async function removeLead(id: string) {
  await verifySession();
  await db.delete(leads).where(eq(leads.id, id));
}
