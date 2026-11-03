import { describe, expect, it } from "vitest";
import { buildWeeklyStats, weekStartCaracas } from "@/lib/leads/stats";

// Lunes 2 de noviembre de 2026, 12:00 UTC (08:00 en Caracas).
const now = new Date("2026-11-02T12:00:00Z");

describe("weekStartCaracas", () => {
  it("usa el lunes de la semana en hora de Venezuela", () => {
    expect(weekStartCaracas(now)).toBe("2026-11-02");
    // Domingo 1 a las 23:00 en Caracas = lunes 2 a las 03:00 UTC: sigue siendo la semana anterior.
    expect(weekStartCaracas(new Date("2026-11-02T03:00:00Z"))).toBe("2026-10-26");
  });
});

describe("buildWeeklyStats", () => {
  it("devuelve las últimas N semanas, de la más reciente a la más antigua, con ceros", () => {
    const stats = buildWeeklyStats([], 3, now);
    expect(stats.map((s) => s.week)).toEqual(["2026-11-02", "2026-10-26", "2026-10-19"]);
    expect(stats.every((s) => s.total === 0)).toBe(true);
  });

  it("suma por semana y agrupa por origen", () => {
    const stats = buildWeeklyStats(
      [
        { week: "2026-11-02", source: "instagram", total: 3 },
        { week: "2026-11-02", source: "directo", total: 1 },
        { week: "2026-10-19", source: "instagram", total: 2 },
      ],
      3,
      now,
    );
    expect(stats[0]).toEqual({ week: "2026-11-02", total: 4, bySource: { instagram: 3, directo: 1 } });
    expect(stats[1]).toEqual({ week: "2026-10-26", total: 0, bySource: {} });
    expect(stats[2]).toEqual({ week: "2026-10-19", total: 2, bySource: { instagram: 2 } });
  });

  it("ignora filas fuera del rango", () => {
    const stats = buildWeeklyStats([{ week: "2026-01-05", source: "x", total: 9 }], 2, now);
    expect(stats.reduce((sum, s) => sum + s.total, 0)).toBe(0);
  });
});
