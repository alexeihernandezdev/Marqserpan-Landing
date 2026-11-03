import type { ActionState } from "@/lib/forms/action-state";

/** Mensaje de resultado de un formulario del admin. */
export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === "error") {
    return (
      <p role="alert" className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">
        {state.message}
      </p>
    );
  }
  if (state.status === "success" && state.message) {
    return (
      <p role="status" className="rounded-md border-2 border-verde-700 bg-green-50 px-4 py-3 font-bold text-verde-800">
        {state.message}
      </p>
    );
  }
  return null;
}
