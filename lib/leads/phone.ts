import type { Country } from "@/lib/validation/lead-constants";

const COUNTRY_CODES: Record<Country, string | null> = {
  VE: "58",
  CO: "57",
  BR: "55",
  CW: "599",
  OTRO: null,
};

/**
 * Normaliza un teléfono a formato internacional (+<código><número>, 8–15 dígitos).
 * Acepta números locales venezolanos (0416…) y los de otros países con o sin código.
 * Devuelve null si no es un teléfono válido.
 */
export function normalizePhone(input: string, country: Country): string | null {
  const compact = input.trim().replace(/[\s().\-/]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;

  let digits: string;
  if (compact.startsWith("+")) {
    digits = compact.slice(1);
  } else if (compact.startsWith("00")) {
    digits = compact.slice(2);
  } else {
    const code = COUNTRY_CODES[country];
    if (!code) return null;
    // Escrito ya con el código de país pero sin "+" (ej. 584161234567).
    if (compact.startsWith(code) && compact.length - code.length >= 10) {
      digits = compact;
    } else {
      digits = code + compact.replace(/^0+/, "");
    }
  }

  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}

export function toWhatsAppLink(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
