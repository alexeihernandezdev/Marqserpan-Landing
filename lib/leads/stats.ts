// Venezuela usa UTC-4 todo el año (sin horario de verano).
const CARACAS_OFFSET_MS = -4 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type WeeklyRow = { week: string; source: string; total: number };
export type WeekStats = { week: string; total: number; bySource: Record<string, number> };

/** Lunes (YYYY-MM-DD) de la semana de `date` en hora de Caracas. */
export function weekStartCaracas(date: Date): string {
  const local = new Date(date.getTime() + CARACAS_OFFSET_MS);
  const daysSinceMonday = (local.getUTCDay() + 6) % 7;
  const monday = new Date(local.getTime() - daysSinceMonday * DAY_MS);
  return monday.toISOString().slice(0, 10);
}

/**
 * Agrupa filas (semana, origen, total) en las últimas `weeks` semanas, de la más reciente a la
 * más antigua. Las semanas sin solicitudes aparecen con 0.
 */
export function buildWeeklyStats(rows: WeeklyRow[], weeks: number, now = new Date()): WeekStats[] {
  const current = new Date(`${weekStartCaracas(now)}T00:00:00Z`);
  const result: WeekStats[] = [];
  for (let i = 0; i < weeks; i++) {
    const week = new Date(current.getTime() - i * 7 * DAY_MS).toISOString().slice(0, 10);
    result.push({ week, total: 0, bySource: {} });
  }
  for (const row of rows) {
    const target = result.find((w) => w.week === row.week);
    if (!target) continue;
    target.total += row.total;
    target.bySource[row.source] = (target.bySource[row.source] ?? 0) + row.total;
  }
  return result;
}
