// Aviso (no bloqueo) para no publicar precios ni plazos fijos (constitución, Principio I).

const PRICE = /(\$|€|\bUSD\b|\bUS\$|\bBs\.?\s*\d|\bBs\.?S?\b|\bbol[ií]vares\b|\bd[oó]lares\b|\beuros?\b)/i;
const DEADLINE = /\b(en|dentro de)\s+\d+\s*(d[ií]as?|semanas?|meses|mes|horas?)\b|\b\d+\s*d[ií]as?\s+h[aá]biles\b/i;

export function detectPriceOrDeadline(text: string): boolean {
  return PRICE.test(text) || DEADLINE.test(text);
}
