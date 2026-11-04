import { describe, expect, it } from "vitest";
import { buildPasswordResetEmail } from "@/lib/email/password-reset";
import { isResetLimited, isResetTokenUsable, RESET_TTL_MS } from "@/lib/auth/session-logic";

const minute = 60 * 1000;
const now = new Date("2026-11-02T12:00:00Z");

describe("enlaces de restablecimiento", () => {
  it("sirve mientras no se use ni venza", () => {
    const expiresAt = new Date(now.getTime() + RESET_TTL_MS);
    expect(isResetTokenUsable({ expiresAt, usedAt: null }, now)).toBe(true);
  });

  it("no sirve una vez usado", () => {
    const expiresAt = new Date(now.getTime() + RESET_TTL_MS);
    expect(isResetTokenUsable({ expiresAt, usedAt: now }, now)).toBe(false);
  });

  it("no sirve vencido", () => {
    expect(isResetTokenUsable({ expiresAt: new Date(now.getTime() - 1), usedAt: null }, now)).toBe(false);
  });

  it("limita a 3 enlaces por hora", () => {
    const recent = [5, 20, 40].map((m) => new Date(now.getTime() - m * minute));
    expect(isResetLimited(recent.slice(0, 2), now)).toBe(false);
    expect(isResetLimited(recent, now)).toBe(true);
  });

  it("los enlaces de hace más de una hora no cuentan", () => {
    const old = [61, 90, 120].map((m) => new Date(now.getTime() - m * minute));
    expect(isResetLimited(old, now)).toBe(false);
  });
});

describe("correo de restablecimiento", () => {
  it("incluye el enlace y escapa el nombre", () => {
    const url = "https://maqserpan.test/admin/restablecer?token=abc";
    const { subject, text, html } = buildPasswordResetEmail("Ana <b>", url);
    expect(subject).toBe("Restablece tu contraseña del panel");
    expect(text).toContain(url);
    expect(html).toContain(`href="${url}"`);
    expect(html).toContain("Ana &lt;b&gt;");
    expect(html).not.toContain("<b>");
  });
});
