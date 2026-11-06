import { CircleAlert, CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import type { ActionState } from "@/lib/forms/action-state";

/** Aviso del panel: error (role="alert"), éxito (role="status") o advertencia sin rol vivo. */
export function Notice({ tone, children }: { tone: "error" | "success" | "warning"; children: ReactNode }) {
  const styles = {
    error: "border-destructive/30 bg-red-50 text-red-800",
    success: "border-verde-700/30 bg-green-50 text-verde-800",
    warning: "border-amber-500/40 bg-amber-50 text-amber-900",
  }[tone];
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  return (
    <Alert role={tone === "error" ? "alert" : tone === "success" ? "status" : "note"} className={styles}>
      <Icon />
      <AlertDescription className="font-medium text-current">{children}</AlertDescription>
    </Alert>
  );
}

/** Mensaje de resultado de un formulario del admin. */
export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === "error") return <Notice tone="error">{state.message}</Notice>;
  if (state.status === "success" && state.message) return <Notice tone="success">{state.message}</Notice>;
  return null;
}
