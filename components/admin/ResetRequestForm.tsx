"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/admin/actions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { idleState } from "@/lib/forms/action-state";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";

export function ResetRequestForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, idleState);
  const email = state.status === "error" ? (state.values?.email ?? "") : "";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormMessage state={state} />
      <FormField id="email" label="Correo" required>
        {(describedBy) => (
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={email}
            key={email}
            aria-describedby={describedBy}
            className="h-10"
            required
          />
        )}
      </FormField>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
