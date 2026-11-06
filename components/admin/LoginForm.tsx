"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { idleState } from "@/lib/forms/action-state";
import { FormField } from "./FormField";
import { Notice } from "./FormMessage";

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
        <Notice tone="success">Contraseña actualizada. Entra con la nueva.</Notice>
      )}
      {state.status === "error" && <Notice tone="error">{state.message}</Notice>}
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
      <FormField id="password" label="Contraseña" required>
        {(describedBy) => (
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-describedby={describedBy}
            className="h-10"
            required
          />
        )}
      </FormField>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
