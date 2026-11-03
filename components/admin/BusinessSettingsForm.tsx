"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { saveBusinessSettings } from "@/app/admin/(panel)/negocio/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { idleState } from "@/lib/forms/action-state";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type BusinessSettingsInput } from "@/lib/validation/business";
import { FormMessage } from "./FormMessage";

export function BusinessSettingsForm({ settings }: { settings: BusinessSettingsInput }) {
  const [state, formAction, pending] = useActionState(saveBusinessSettings, idleState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  // Sin reinicio automático del formulario: lo escrito se conserva si hay errores.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <FormMessage state={state} />

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-xl font-display">Contacto</legend>
        <Field id="whatsapp" label="WhatsApp" required hint="Formato internacional, ej. +584166873369" errors={errors.whatsapp}>
          {(d) => <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={settings.whatsapp} aria-describedby={d} required />}
        </Field>
        <Field id="email" label="Correo" required hint="Aquí llegan los avisos de solicitudes." errors={errors.email}>
          {(d) => <Input id="email" name="email" type="email" defaultValue={settings.email} aria-describedby={d} required />}
        </Field>
        <Field id="address" label="Dirección" hint="Vacía, no se muestra." errors={errors.address}>
          {(d) => <Textarea id="address" name="address" rows={2} defaultValue={settings.address} maxLength={200} aria-describedby={d} />}
        </Field>
        <Field id="businessHours" label="Horario" hint="Vacío, no se muestra." errors={errors.businessHours}>
          {(d) => <Textarea id="businessHours" name="businessHours" rows={2} defaultValue={settings.businessHours} maxLength={200} aria-describedby={d} />}
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-xl font-display">Redes sociales</legend>
        <p className="text-sm text-gris">
          Deja el enlace vacío para ocultar una red. Las marcadas «de prueba» no se muestran en el sitio publicado.
        </p>
        {SOCIAL_NETWORKS.map((network, index) => {
          const link = settings.socialLinks.find((l) => l.network === network);
          const id = `social_${network}`;
          return (
            <div key={network} className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
              <Field id={id} label={`Enlace de ${SOCIAL_LABELS[network]}`} errors={errors[`socialLinks.${index}.url`]}>
                {(d) => <Input id={id} name={id} type="url" placeholder="https://" defaultValue={link?.url ?? ""} aria-describedby={d} />}
              </Field>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" name={`${id}_test`} defaultChecked={link?.isTest ?? false} className="size-5 accent-verde-700" />
                De prueba
              </label>
            </div>
          );
        })}
      </fieldset>

      <fieldset className="grid gap-5 lg:grid-cols-3">
        <legend className="mb-3 text-xl font-display">Pagos y envíos</legend>
        <Field id="paymentMethods" label="Formas de pago" hint="Una por línea." errors={errors.paymentMethods}>
          {(d) => <Textarea id="paymentMethods" name="paymentMethods" rows={5} defaultValue={settings.paymentMethods.join("\n")} aria-describedby={d} />}
        </Field>
        <Field id="shippingCoverage" label="Cobertura de envíos" hint="Un país o zona por línea." errors={errors.shippingCoverage}>
          {(d) => <Textarea id="shippingCoverage" name="shippingCoverage" rows={5} defaultValue={settings.shippingCoverage.join("\n")} aria-describedby={d} />}
        </Field>
        <Field id="deliveryTerms" label="Condiciones de entrega" hint="Una por línea." errors={errors.deliveryTerms}>
          {(d) => <Textarea id="deliveryTerms" name="deliveryTerms" rows={5} defaultValue={settings.deliveryTerms.join("\n")} aria-describedby={d} />}
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-xl font-display">Datos legales</legend>
        <Field id="legalName" label="Razón social" errors={errors.legalName}>
          {(d) => <Input id="legalName" name="legalName" defaultValue={settings.legalName} maxLength={120} aria-describedby={d} />}
        </Field>
        <Field id="rif" label="RIF" errors={errors.rif}>
          {(d) => <Input id="rif" name="rif" defaultValue={settings.rif} maxLength={20} aria-describedby={d} />}
        </Field>
      </fieldset>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Guardar datos del negocio"}
      </Button>
    </form>
  );
}
