// Forma común de respuesta de las Server Actions con formularios (contracts/server-actions.md).
export type ActionState =
  | { status: "idle" }
  | { status: "success"; message?: string; data?: Record<string, string> }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: Record<string, string>;
    };

export const idleState: ActionState = { status: "idle" };

/** Copia los campos de texto indicados para devolverlos al formulario y no perder lo escrito. */
export function pickValues(formData: FormData, fields: readonly string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}
