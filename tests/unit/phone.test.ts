import { describe, expect, it } from "vitest";
import { normalizePhone, toWhatsAppLink } from "@/lib/leads/phone";

describe("normalizePhone", () => {
  it("convierte números venezolanos locales a formato internacional", () => {
    expect(normalizePhone("0416-1234567", "VE")).toBe("+584161234567");
    expect(normalizePhone("0414 123 45 67", "VE")).toBe("+584141234567");
  });

  it("conserva números que ya traen código de país", () => {
    expect(normalizePhone("+57 300 1234567", "CO")).toBe("+573001234567");
    expect(normalizePhone("+58 (416) 687-3369", "VE")).toBe("+584166873369");
  });

  it("acepta el prefijo 00 como internacional", () => {
    expect(normalizePhone("00599 9 1234567", "CW")).toBe("+59991234567");
  });

  it("añade el código del país elegido si falta", () => {
    expect(normalizePhone("4161234567", "VE")).toBe("+584161234567");
    expect(normalizePhone("11 91234 5678", "BR")).toBe("+5511912345678");
  });

  it("rechaza números con letras o con menos de 8 o más de 15 dígitos", () => {
    expect(normalizePhone("abc", "VE")).toBeNull();
    expect(normalizePhone("+58 123", "VE")).toBeNull();
    expect(normalizePhone("+1234567890123456", "OTRO")).toBeNull();
  });
});

describe("toWhatsAppLink", () => {
  it("quita el + para wa.me", () => {
    expect(toWhatsAppLink("+584166873369")).toBe("https://wa.me/584166873369");
  });
});
