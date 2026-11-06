import type { ReactNode } from "react";
import { Label } from "@/components/shadcn/label";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  errors?: string[];
  /** Junto a la etiqueta, a la derecha (p. ej. un contador de caracteres). */
  aside?: ReactNode;
  children: (describedBy: string | undefined) => ReactNode;
};

/** Campo del panel: etiqueta, ayuda y error enlazados al control con aria-describedby. */
export function FormField({ id, label, required, hint, errors, aside, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="font-semibold">
          {label}
          {!required && <span className="font-normal text-muted-foreground">(opcional)</span>}
        </Label>
        {aside}
      </div>
      {children(describedBy)}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {errorId && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {errors![0]}
        </p>
      )}
    </div>
  );
}
