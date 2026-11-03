type SourceInput = {
  utmSource?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  siteHost: string;
};

/**
 * Origen de una solicitud (data-model.md): utm_source si existe; si no, el navegador interno
 * de Instagram o Facebook; si no, el dominio de referencia externo; si no, "directo".
 */
export function deriveSource({ utmSource, referrer, userAgent, siteHost }: SourceInput): string {
  const utm = utmSource?.trim().toLowerCase();
  if (utm) return utm.slice(0, 200);

  const ua = userAgent ?? "";
  if (/\bInstagram\b/i.test(ua)) return "instagram";
  if (/\bFBAN\b|\bFBAV\b|\bFB_IAB\b/i.test(ua)) return "facebook";

  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      const site = siteHost.replace(/^www\./, "").split(":")[0];
      if (host && host !== site) return host;
    } catch {
      // Referencia inválida: se ignora.
    }
  }

  return "directo";
}
