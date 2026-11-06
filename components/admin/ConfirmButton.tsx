"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/shadcn/button";

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
      <Button
        type="button"
        variant="outline"
        onClick={() => setAsking(true)}
        className="text-destructive hover:bg-red-50 hover:text-destructive"
      >
        <Trash2 /> {label}
      </Button>
    );
  }
  return (
    <div
      role="group"
      aria-label={question}
      className="flex flex-wrap items-center gap-2 rounded-md border border-destructive/30 bg-red-50 px-3 py-2"
    >
      <span className="text-sm font-medium text-red-800">{question}</span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => void (await onConfirm()))}
      >
        {pending ? "Borrando…" : confirmLabel}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setAsking(false)} disabled={pending}>
        Cancelar
      </Button>
    </div>
  );
}
