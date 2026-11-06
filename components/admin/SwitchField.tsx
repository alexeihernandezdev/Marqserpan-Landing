"use client";

import type { ComponentProps } from "react";
import { Label } from "@/components/shadcn/label";
import { Switch } from "@/components/shadcn/switch";

type Props = Omit<ComponentProps<typeof Switch>, "id"> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
};

/** Interruptor con etiqueta y descripción, en una fila fácil de tocar. */
export function SwitchField({ id, label, description, error, ...props }: Props) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="font-semibold">
            {label}
          </Label>
          {description && (
            <p id={descriptionId} className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Switch
          id={id}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
