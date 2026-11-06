"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/actions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { idleState } from "@/lib/forms/action-state";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, idleState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <FormMessage state={state} />
      <FormField id="current" label="Contraseña actual" required errors={errors.current}>
        {(d) => (
          <Input id="current" name="current" type="password" autoComplete="current-password" aria-describedby={d} aria-invalid={errors.current ? true : undefined} required />
        )}
      </FormField>
      <FormField id="next" label="Nueva contraseña" required hint="Mínimo 10 caracteres." errors={errors.next}>
        {(d) => (
          <Input id="next" name="next" type="password" autoComplete="new-password" aria-describedby={d} aria-invalid={errors.next ? true : undefined} minLength={10} required />
        )}
      </FormField>
      <FormField id="confirm" label="Repite la nueva contraseña" required errors={errors.confirm}>
        {(d) => (
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-describedby={d} aria-invalid={errors.confirm ? true : undefined} required />
        )}
      </FormField>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
