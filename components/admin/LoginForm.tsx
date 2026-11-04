"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { idleState } from "@/lib/forms/action-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, idleState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const passwordReset = searchParams.get("restablecida") === "1";
  const email = state.status === "error" ? (state.values?.email ?? "") : "";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      {passwordReset && state.status === "idle" && (
        <p role="status" className="rounded-md border-2 border-verde-700 bg-green-50 px-4 py-3 font-bold text-verde-800">
          Contraseña actualizada. Entra con la nueva.
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">
          {state.message}
        </p>
      )}
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
      <Field id="password" label="Contraseña" required>
        {(describedBy) => (
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-describedby={describedBy}
            required
          />
        )}
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
