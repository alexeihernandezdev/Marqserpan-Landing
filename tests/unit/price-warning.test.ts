import { describe, expect, it } from "vitest";
import { detectPriceOrDeadline } from "@/lib/validation/price-warning";

describe("detectPriceOrDeadline", () => {
  it("detecta símbolos y monedas", () => {
    expect(detectPriceOrDeadline("Desde $150")).toBe(true);
    expect(detectPriceOrDeadline("Solo 300 USD")).toBe(true);
    expect(detectPriceOrDeadline("Precio: Bs. 4.500")).toBe(true);
    expect(detectPriceOrDeadline("A 99 €")).toBe(true);
    expect(detectPriceOrDeadline("Por 200 dólares")).toBe(true);
  });

  it("detecta plazos fijos", () => {
    expect(detectPriceOrDeadline("Te lo entregamos en 5 días")).toBe(true);
    expect(detectPriceOrDeadline("Listo en 2 semanas")).toBe(true);
    expect(detectPriceOrDeadline("Entrega en 48 horas")).toBe(true);
    expect(detectPriceOrDeadline("3 días hábiles")).toBe(true);
  });

  it("no marca textos normales", () => {
    expect(detectPriceOrDeadline("22 años en Puerto Ordaz")).toBe(false);
    expect(detectPriceOrDeadline("Con disponibilidad inmediata, instalamos al día siguiente.")).toBe(false);
    expect(detectPriceOrDeadline("Rebanadora de 300 mm")).toBe(false);
    expect(detectPriceOrDeadline("Tu equipo trabajando en 3 pasos")).toBe(false);
  });
});
