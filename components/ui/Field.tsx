import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  errors?: string[];
  children: (describedBy: string | undefined) => ReactNode;
};

/** Etiqueta, ayuda y error enlazados al control con aria-describedby. */
export function Field({ id, label, required, hint, errors, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-carbon">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-700">
            {" "}*
          </span>
        ) : (
          <span className="font-normal text-gris"> (opcional)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-gris">
          {hint}
        </p>
      )}
      {children(describedBy)}
      {errorId && (
        <p id={errorId} className="text-sm font-bold text-red-700">
          {errors![0]}
        </p>
      )}
    </div>
  );
}

export const controlClasses =
  "w-full rounded-xl border-2 border-neutral-300 bg-white px-3.5 py-2.5 text-base text-carbon transition-shadow placeholder:text-neutral-500 focus:border-azul-700 focus:outline-none focus:ring-4 focus:ring-azul-700/15 aria-invalid:border-red-700";
