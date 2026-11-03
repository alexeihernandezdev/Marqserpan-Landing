export const LEAD_TYPES = ["equipo", "repuesto", "servicio_tecnico"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  equipo: "Equipo",
  repuesto: "Repuesto",
  servicio_tecnico: "Servicio técnico",
};

export const COUNTRIES = ["VE", "CO", "BR", "CW", "OTRO"] as const;
export type Country = (typeof COUNTRIES)[number];

export const COUNTRY_LABELS: Record<Country, string> = {
  VE: "Venezuela",
  CO: "Colombia",
  BR: "Brasil",
  CW: "Curaçao",
  OTRO: "Otro país",
};

export const LEAD_STATUSES = ["nueva", "atendida"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
