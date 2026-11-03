"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  label: string;
  confirmLabel?: string;
  question: string;
  onConfirm: () => Promise<unknown>;
};

/** Acción destructiva en dos pasos, sin diálogos nativos del navegador. */
export function ConfirmButton({ label, confirmLabel = "Sí, borrar", question, onConfirm }: Props) {
  const [asking, setAsking] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!asking) {
    return (
      <Button type="button" variant="secondary" onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }
  return (
    <div role="group" aria-label={question} className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold">{question}</span>
      <Button
        type="button"
        variant="danger"
        disabled={pending}
        onClick={() => startTransition(async () => void (await onConfirm()))}
      >
        {pending ? "Borrando…" : confirmLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setAsking(false)} disabled={pending}>
        Cancelar
      </Button>
    </div>
  );
}
