"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { idleState } from "@/lib/forms/action-state";
import { FormMessage } from "./FormMessage";

export function ResetRequestForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, idleState);
  const email = state.status === "error" ? (state.values?.email ?? "") : "";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormMessage state={state} />
      <Field id="email" label="Correo" required>
        {(describedBy) => (
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={email}
            key={email}
            aria-describedby={describedBy}
            required
          />
        )}
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
