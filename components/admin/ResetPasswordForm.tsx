"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { idleState } from "@/lib/forms/action-state";
import { FormMessage } from "./FormMessage";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, idleState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const expired = state.status === "error" && !state.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <FormMessage state={state} />
      {expired && (
        <Link href="/admin/recuperar" className="font-bold underline">
          Pedir un enlace nuevo
        </Link>
      )}
      <Field id="next" label="Nueva contraseña" required hint="Mínimo 10 caracteres." errors={errors.next}>
        {(d) => <Input id="next" name="next" type="password" autoComplete="new-password" aria-describedby={d} minLength={10} required />}
      </Field>
      <Field id="confirm" label="Repite la nueva contraseña" required errors={errors.confirm}>
        {(d) => <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-describedby={d} required />}
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
