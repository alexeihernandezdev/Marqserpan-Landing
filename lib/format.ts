const dateTime = new Intl.DateTimeFormat("es-VE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Caracas",
});

const dateOnly = new Intl.DateTimeFormat("es-VE", { day: "numeric", month: "short", timeZone: "UTC" });

export const formatDateTime = (date: Date) => dateTime.format(date);

/** "2026-11-02" → "2 nov". */
export const formatWeek = (isoDate: string) => dateOnly.format(new Date(`${isoDate}T00:00:00Z`));
