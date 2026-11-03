"use client";

import { useActionState, useEffect, useRef, useState, startTransition, type FormEvent } from "react";
import { submitLead } from "@/app/(site)/actions";
import { readAttribution } from "@/components/site/AttributionCapture";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { type ActionState, idleState } from "@/lib/forms/action-state";
import { toWhatsAppLink } from "@/lib/leads/phone";
import { COUNTRIES, COUNTRY_LABELS, type LeadType } from "@/lib/validation/lead-constants";
import type { Sections } from "@/lib/validation/content";

export type QuoteFormProduct = { slug: string; name: string };

type QuoteFormProps = {
  content: Sections["quote_form"];
  whatsapp: string;
  /** Producto preseleccionado desde una ficha (US2). */
  product?: QuoteFormProduct | null;
  onClearProduct?: () => void;
};

const TYPE_OPTIONS: { value: LeadType; label: string; description: string }[] = [
  { value: "equipo", label: "Equipo", description: "Comprar o fabricar" },
  { value: "repuesto", label: "Repuesto", description: "Para tu máquina" },
  { value: "servicio_tecnico", label: "Servicio técnico", description: "Reparación o revisión" },
];

const EMPTY = {
  type: "",
  name: "",
  phone: "",
  email: "",
  businessName: "",
  city: "",
  country: "VE",
  message: "",
};

type Values = typeof EMPTY;

// Un fallo de red hace que la Server Action lance: se convierte en un error visible y se conserva lo escrito.
async function submitSafely(prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    return await submitLead(prev, formData);
  } catch {
    return {
      status: "error",
      message: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.",
    };
  }
}

function newSubmissionId() {
  const c = globalThis.crypto;
  if (typeof c.randomUUID === "function") return c.randomUUID();
  // Navegadores sin randomUUID (contextos antiguos): UUID v4 con getRandomValues.
  const bytes = c.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function QuoteFormInner({ content, whatsapp, product, onClearProduct, onReset }: QuoteFormProps & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitSafely, idleState);
  const [values, setValues] = useState<Values>(EMPTY);
  // Se fijan al montar en el navegador (no en el prerender): id contra duplicados y hora para el antispam.
  const meta = useRef({ submissionId: "", renderedAt: 0 });
  const submitting = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    meta.current = { submissionId: newSubmissionId(), renderedAt: Date.now() };
  }, []);

  // Desde la ficha de un producto, el tipo «equipo» queda elegido si la persona no eligió otro.
  const type = values.type || (product ? "equipo" : "");

  useEffect(() => {
    if (!pending) submitting.current = false;
    if (state.status === "success") successHeading.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state, pending]);

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || pending) return;
    submitting.current = true;
    if (!meta.current.submissionId) {
      meta.current = { submissionId: newSubmissionId(), renderedAt: Date.now() };
    }
    const formData = new FormData(event.currentTarget);
    formData.set("submissionId", meta.current.submissionId);
    formData.set("renderedAt", String(meta.current.renderedAt));
    for (const [key, value] of Object.entries(readAttribution())) {
      if (value) formData.set(key, value);
    }
    startTransition(() => formAction(formData));
  }

  if (state.status === "success") {
    const businessWhatsapp = state.data?.whatsapp || whatsapp;
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-2xl shadow-black/30 sm:p-10">
        <h3 ref={successHeading} tabIndex={-1} className="text-2xl text-verde-800 outline-none">
          {content.successTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-md whitespace-pre-line text-carbon">{content.successBody}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {businessWhatsapp && (
            <a
              href={toWhatsAppLink(businessWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-verde-700 px-5 font-bold text-white hover:bg-verde-800"
            >
              Escribir por WhatsApp
            </a>
          )}
          <Button type="button" variant="secondary" onClick={onReset}>
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    );
  }

  const invalid = (key: string) => (errors[key]?.length ? true : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-3xl bg-white p-5 text-carbon shadow-2xl shadow-black/30 sm:p-8">
      {product && (
        <>
          <input type="hidden" name="productSlug" value={product.slug} />
          <input type="hidden" name="productName" value={product.name} />
        </>
      )}
      {/* Campo trampa: las personas no lo ven ni lo oyen; los bots lo rellenan. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">No escribas aquí</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.status === "error" && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800 outline-none"
        >
          {state.message}
        </p>
      )}

      {product && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-verde-700/15 bg-verde-700/5 px-4 py-3">
          <p>
            <span className="text-gris">Producto: </span>
            <strong>{product.name}</strong>
          </p>
          {onClearProduct && (
            <button type="button" onClick={onClearProduct} className="text-sm font-bold underline underline-offset-4">
              Quitar
            </button>
          )}
        </div>
      )}

      <RadioGroup
        name="type"
        legend="¿Qué necesitas?"
        required
        options={TYPE_OPTIONS}
        value={type}
        onChange={set("type")}
        errors={errors.type}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nombre" required errors={errors.name}>
          {(describedBy) => (
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              aria-invalid={invalid("name")}
              aria-describedby={describedBy}
              required
            />
          )}
        </Field>
        <Field id="phone" label="Teléfono o WhatsApp" required hint="Ej. 0416-1234567 o +57 300 1234567" errors={errors.phone}>
          {(describedBy) => (
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone")(e.target.value)}
              aria-invalid={invalid("phone")}
              aria-describedby={describedBy}
              required
            />
          )}
        </Field>
        <Field id="city" label="Ciudad" required errors={errors.city}>
          {(describedBy) => (
            <Input
              id="city"
              name="city"
              autoComplete="address-level2"
              value={values.city}
              onChange={(e) => set("city")(e.target.value)}
              aria-invalid={invalid("city")}
              aria-describedby={describedBy}
              required
            />
          )}
        </Field>
        <Field id="country" label="País" required errors={errors.country}>
          {(describedBy) => (
            <Select
              id="country"
              name="country"
              value={values.country}
              onChange={(e) => set("country")(e.target.value)}
              aria-invalid={invalid("country")}
              aria-describedby={describedBy}
            >
              {COUNTRIES.map((code) => (
                <option key={code} value={code}>
                  {COUNTRY_LABELS[code]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field
        id="message"
        label="Cuéntanos qué necesitas"
        required
        hint="Equipo, modelo o máquina, y cualquier detalle que nos ayude a cotizar."
        errors={errors.message}
      >
        {(describedBy) => (
          <Textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            aria-invalid={invalid("message")}
            aria-describedby={describedBy}
            required
          />
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Correo" errors={errors.email}>
          {(describedBy) => (
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              aria-invalid={invalid("email")}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field id="businessName" label="Nombre de tu negocio" errors={errors.businessName}>
          {(describedBy) => (
            <Input
              id="businessName"
              name="businessName"
              autoComplete="organization"
              value={values.businessName}
              onChange={(e) => set("businessName")(e.target.value)}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
        {pending ? "Enviando…" : "Enviar solicitud"}
      </Button>
      <p className="text-sm text-gris">
        Usamos tus datos solo para responder tu solicitud. Sin precios fijos: cotizamos cada pedido con su precio y su plazo.
      </p>
    </form>
  );
}

/** Formulario de cotización (FR-011 a FR-016). «Enviar otra solicitud» lo reinicia por completo. */
export function QuoteForm(props: QuoteFormProps) {
  const [resetKey, setResetKey] = useState(0);
  return <QuoteFormInner key={resetKey} {...props} onReset={() => setResetKey((k) => k + 1)} />;
}
