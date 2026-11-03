import { describe, expect, it } from "vitest";
import {
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  newExpiry,
  safeAdminRedirect,
  shouldRenewSession,
} from "@/lib/auth/session-logic";

const day = 24 * 60 * 60 * 1000;
const now = new Date("2026-11-02T12:00:00Z");

describe("tokens de sesión", () => {
  it("genera tokens distintos y largos", () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
  });

  it("guarda solo el hash, que no revela el token", () => {
    const token = generateSessionToken();
    const hash = hashSessionToken(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(token);
    expect(hashSessionToken(token)).toBe(hash);
  });
});

describe("vigencia", () => {
  it("dura 7 días", () => {
    expect(newExpiry(now).getTime() - now.getTime()).toBe(7 * day);
  });

  it("rechaza una sesión vencida", () => {
    expect(isSessionExpired(new Date(now.getTime() - 1), now)).toBe(true);
    expect(isSessionExpired(new Date(now.getTime() + day), now)).toBe(false);
  });

  it("se renueva solo si quedan menos de 3 días", () => {
    expect(shouldRenewSession(new Date(now.getTime() + 2 * day), now)).toBe(true);
    expect(shouldRenewSession(new Date(now.getTime() + 5 * day), now)).toBe(false);
  });
});

describe("safeAdminRedirect", () => {
  it("acepta rutas internas del admin", () => {
    expect(safeAdminRedirect("/admin/solicitudes?estado=nueva")).toBe("/admin/solicitudes?estado=nueva");
  });

  it("rechaza destinos externos o raros", () => {
    expect(safeAdminRedirect("https://otro.sitio")).toBe("/admin");
    expect(safeAdminRedirect("//otro.sitio/admin")).toBe("/admin");
    expect(safeAdminRedirect("/admin@otro.sitio")).toBe("/admin");
    expect(safeAdminRedirect(String.raw`/admin\..\x`)).toBe("/admin");
    expect(safeAdminRedirect("/administrador")).toBe("/admin");
    expect(safeAdminRedirect("/admin/login")).toBe("/admin");
    expect(safeAdminRedirect(null)).toBe("/admin");
  });
});
