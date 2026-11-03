"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { idleState } from "@/lib/forms/action-state";
import { FormMessage } from "./FormMessage";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, idleState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <FormMessage state={state} />
      <Field id="current" label="Contraseña actual" required errors={errors.current}>
        {(d) => <Input id="current" name="current" type="password" autoComplete="current-password" aria-describedby={d} required />}
      </Field>
      <Field id="next" label="Nueva contraseña" required hint="Mínimo 10 caracteres." errors={errors.next}>
        {(d) => <Input id="next" name="next" type="password" autoComplete="new-password" aria-describedby={d} minLength={10} required />}
      </Field>
      <Field id="confirm" label="Repite la nueva contraseña" required errors={errors.confirm}>
        {(d) => <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-describedby={d} required />}
      </Field>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
