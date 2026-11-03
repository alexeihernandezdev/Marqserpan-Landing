"use client";

import { useEffect } from "react";

const STORAGE_KEY = "mq_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingUrl?: string;
  referrer?: string;
};

const toCamel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

/** Lee el origen guardado en la primera página de la visita. */
export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/**
 * Guarda los parámetros UTM, la URL de entrada (solo ruta + UTM, sin identificadores como
 * fbclid) y la referencia en la primera carga de la sesión. Así la página sigue siendo estática.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      const url = new URL(window.location.href);
      const attribution: Record<string, string> = {};
      const kept = new URLSearchParams();
      for (const key of UTM_KEYS) {
        const value = url.searchParams.get(key);
        if (value) {
          attribution[toCamel(key)] = value.slice(0, 200);
          kept.set(key, value);
        }
      }
      const query = kept.toString();
      attribution.landingUrl = `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
      if (document.referrer) attribution.referrer = document.referrer.slice(0, 2000);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // Sin sessionStorage (modo privado estricto): la solicitud se guarda igual, sin origen.
    }
  }, []);

  return null;
}
