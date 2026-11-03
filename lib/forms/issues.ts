import type { z } from "zod";

/** Errores de Zod indexados por ruta con puntos ("points.0", "steps.1.title"). */
export function issuesByPath(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (result[key] ??= []).push(issue.message);
  }
  return result;
}
