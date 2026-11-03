import { describe, expect, it } from "vitest";
import { isLockedOut } from "@/lib/auth/session-logic";

const now = new Date("2026-11-02T12:00:00Z");
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);
const fail = (m: number) => ({ succeeded: false, createdAt: minutesAgo(m) });
const ok = (m: number) => ({ succeeded: true, createdAt: minutesAgo(m) });

describe("isLockedOut", () => {
  it("no bloquea con menos de 5 fallos", () => {
    expect(isLockedOut([fail(1), fail(2), fail(3), fail(4)], now)).toBe(false);
  });

  it("bloquea con 5 fallos en 15 minutos", () => {
    expect(isLockedOut([fail(1), fail(2), fail(3), fail(4), fail(14)], now)).toBe(true);
  });

  it("ignora los fallos de hace más de 15 minutos", () => {
    expect(isLockedOut([fail(1), fail(2), fail(3), fail(4), fail(16)], now)).toBe(false);
  });

  it("un acierto no borra los fallos de la ventana", () => {
    expect(isLockedOut([fail(1), fail(2), ok(3), fail(4), fail(5), fail(6)], now)).toBe(true);
  });
});
