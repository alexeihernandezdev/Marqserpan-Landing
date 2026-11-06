"use client";

import { startTransition, useActionState, useId, type FormEvent, type ReactNode } from "react";
import { saveBusinessSettings } from "@/app/admin/(panel)/negocio/actions";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { idleState } from "@/lib/forms/action-state";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type BusinessSettingsInput } from "@/lib/validation/business";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";

/** Grupo del formulario en su propia tarjeta, nombrado por su título. */
function Group({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const titleId = useId();
  return (
    <Card role="group" aria-labelledby={titleId} className="gap-5">
      <CardHeader>
        <CardTitle>
          <h2 id={titleId} className="text-xl">
            {title}
          </h2>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormMessage state={state} />

      <Group title="Contacto">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="whatsapp" label="WhatsApp" required hint="Formato internacional, ej. +584166873369" errors={errors.whatsapp}>
            {(d) => <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={settings.whatsapp} aria-describedby={d} aria-invalid={errors.whatsapp ? true : undefined} required />}
          </FormField>
          <FormField id="email" label="Correo" required hint="Aquí llegan los avisos de solicitudes." errors={errors.email}>
            {(d) => <Input id="email" name="email" type="email" defaultValue={settings.email} aria-describedby={d} aria-invalid={errors.email ? true : undefined} required />}
          </FormField>
          <FormField id="address" label="Dirección" hint="Vacía, no se muestra." errors={errors.address}>
            {(d) => <Textarea id="address" name="address" rows={2} defaultValue={settings.address} maxLength={200} aria-describedby={d} />}
          </FormField>
          <FormField id="businessHours" label="Horario" hint="Vacío, no se muestra." errors={errors.businessHours}>
            {(d) => <Textarea id="businessHours" name="businessHours" rows={2} defaultValue={settings.businessHours} maxLength={200} aria-describedby={d} />}
          </FormField>
        </div>
      </Group>

      <Group
        title="Redes sociales"
        description="Deja el enlace vacío para ocultar una red. Las marcadas «de prueba» no se muestran en el sitio publicado."
      >
        <div className="flex flex-col gap-4">
          {SOCIAL_NETWORKS.map((network, index) => {
            const link = settings.socialLinks.find((l) => l.network === network);
            const id = `social_${network}`;
            return (
              <div key={network} className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                <FormField id={id} label={`Enlace de ${SOCIAL_LABELS[network]}`} errors={errors[`socialLinks.${index}.url`]}>
                  {(d) => <Input id={id} name={id} type="url" placeholder="https://" defaultValue={link?.url ?? ""} aria-describedby={d} />}
                </FormField>
                <div className="flex h-9 items-center gap-2">
                  <Checkbox id={`${id}_test`} name={`${id}_test`} defaultChecked={link?.isTest ?? false} />
                  <Label htmlFor={`${id}_test`} className="font-normal">
                    De prueba
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </Group>

      <Group title="Pagos y envíos">
        <div className="grid gap-5 lg:grid-cols-3">
          <FormField id="paymentMethods" label="Formas de pago" hint="Una por línea." errors={errors.paymentMethods}>
            {(d) => <Textarea id="paymentMethods" name="paymentMethods" rows={5} defaultValue={settings.paymentMethods.join("\n")} aria-describedby={d} />}
          </FormField>
          <FormField id="shippingCoverage" label="Cobertura de envíos" hint="Un país o zona por línea." errors={errors.shippingCoverage}>
            {(d) => <Textarea id="shippingCoverage" name="shippingCoverage" rows={5} defaultValue={settings.shippingCoverage.join("\n")} aria-describedby={d} />}
          </FormField>
          <FormField id="deliveryTerms" label="Condiciones de entrega" hint="Una por línea." errors={errors.deliveryTerms}>
            {(d) => <Textarea id="deliveryTerms" name="deliveryTerms" rows={5} defaultValue={settings.deliveryTerms.join("\n")} aria-describedby={d} />}
          </FormField>
        </div>
      </Group>

      <Group title="Datos legales">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="legalName" label="Razón social" errors={errors.legalName}>
            {(d) => <Input id="legalName" name="legalName" defaultValue={settings.legalName} maxLength={120} aria-describedby={d} />}
          </FormField>
          <FormField id="rif" label="RIF" errors={errors.rif}>
            {(d) => <Input id="rif" name="rif" defaultValue={settings.rif} maxLength={20} aria-describedby={d} />}
          </FormField>
        </div>
      </Group>

      <div className="sticky bottom-0 -mx-4 flex justify-end border-t bg-hueso/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar datos del negocio"}
        </Button>
      </div>
    </form>
  );
}
