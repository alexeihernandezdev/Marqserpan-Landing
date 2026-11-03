"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { saveSection } from "@/app/admin/(panel)/contenido/actions";
import { Button } from "@/components/ui/Button";
import { controlClasses } from "@/components/ui/Field";
import type { EditorField } from "@/lib/content/editor-fields";
import { idleState } from "@/lib/forms/action-state";
import { detectPriceOrDeadline } from "@/lib/validation/price-warning";
import { FormMessage } from "./FormMessage";

type Pair = { title: string; body: string };
type Data = Record<string, string | string[] | Pair[]>;

type Props = { sectionKey: string; fields: EditorField[]; initialData: Data };

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs ${over ? "font-bold text-red-700" : "text-gris"}`}>
      {value.length}/{max}
    </span>
  );
}

function TextControl({
  id,
  label,
  value,
  max,
  multiline,
  required,
  hint,
  errors,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  max: number;
  multiline?: boolean;
  required?: boolean;
  hint?: string;
  errors?: string[];
  onChange: (value: string) => void;
}) {
  const describedBy = [hint ? `${id}-hint` : null, errors ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const props = {
    id,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    "aria-invalid": errors ? true : undefined,
    "aria-describedby": describedBy,
    required,
    className: controlClasses,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold">
          {label}
          {!required && <span className="font-normal text-gris"> (opcional)</span>}
        </label>
        <Counter value={value} max={max} />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-gris">
          {hint}
        </p>
      )}
      {multiline ? <textarea rows={3} {...props} /> : <input {...props} />}
      {errors && (
        <p id={`${id}-error`} className="text-sm font-bold text-red-700">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

/** Editor de una sección de la historia, generado desde la descripción de sus campos. */
export function SectionEditor({ sectionKey, fields, initialData }: Props) {
  const [state, formAction, pending] = useActionState(saveSection.bind(null, sectionKey), idleState);
  const [data, setData] = useState<Data>(initialData);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  const allText = Object.values(data)
    .flatMap((v) => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : `${x.title} ${x.body}`)) : [v]))
    .join("\n");
  const warn = detectPriceOrDeadline(allText);

  const setField = (name: string, value: Data[string]) => setData((d) => ({ ...d, [name]: value }));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("data", JSON.stringify(data));
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormMessage state={state} />
      {warn && (
        <p className="rounded-md border-2 border-amarillo bg-amarillo-50 px-4 py-3 text-sm">
          <strong>Atención:</strong> parece que el texto incluye un precio o un plazo fijo. La landing no publica precios
          ni plazos: cada pedido se cotiza. Puedes guardar igual si es correcto.
        </p>
      )}

      {fields.map((field) => {
        if (field.kind === "text" || field.kind === "textarea") {
          return (
            <TextControl
              key={field.name}
              id={field.name}
              label={field.label}
              value={String(data[field.name] ?? "")}
              max={field.max}
              multiline={field.kind === "textarea"}
              required={field.required}
              hint={field.hint}
              errors={errors[field.name]}
              onChange={(value) => setField(field.name, value)}
            />
          );
        }

        if (field.kind === "list") {
          const items = (data[field.name] as string[]) ?? [];
          return (
            <fieldset key={field.name} className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
              <legend className="px-1 text-sm font-bold">
                {field.label}{" "}
                <span className="font-normal text-gris">
                  ({field.minItems === field.maxItems ? field.maxItems : `${field.minItems}–${field.maxItems}`})
                </span>
              </legend>
              {errors[field.name] && <p className="text-sm font-bold text-red-700">{errors[field.name]?.[0]}</p>}
              {items.map((item, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextControl
                      id={`${field.name}-${index}`}
                      label={`${field.itemLabel} ${index + 1}`}
                      value={item}
                      max={field.max}
                      required
                      errors={errors[`${field.name}.${index}`]}
                      onChange={(value) => setField(field.name, items.map((x, i) => (i === index ? value : x)))}
                    />
                  </div>
                  {items.length > field.minItems && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setField(field.name, items.filter((_, i) => i !== index))}
                      aria-label={`Quitar ${field.itemLabel.toLowerCase()} ${index + 1}`}
                    >
                      Quitar
                    </Button>
                  )}
                </div>
              ))}
              {items.length < field.maxItems && (
                <Button type="button" variant="secondary" className="self-start" onClick={() => setField(field.name, [...items, ""])}>
                  Agregar {field.itemLabel.toLowerCase()}
                </Button>
              )}
            </fieldset>
          );
        }

        if (field.kind !== "pairs") return null;
        const pf = field; // constante: conserva el tipo estrechado dentro de los closures
        const pairs = (data[pf.name] as Pair[]) ?? [];
        return (
          <fieldset key={pf.name} className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
            <legend className="px-1 text-sm font-bold">{pf.label}</legend>
            {errors[pf.name] && <p className="text-sm font-bold text-red-700">{errors[pf.name]?.[0]}</p>}
            {pairs.map((pair, index) => (
              <div key={index} className="flex flex-col gap-3 border-l-4 border-amarillo pl-4">
                <TextControl
                  id={`${pf.name}-${index}-title`}
                  label={`${pf.itemLabel} ${index + 1}: título`}
                  value={pair.title}
                  max={pf.titleMax}
                  required
                  errors={errors[`${pf.name}.${index}.title`]}
                  onChange={(value) => setField(pf.name, pairs.map((p, i) => (i === index ? { ...p, title: value } : p)))}
                />
                <TextControl
                  id={`${pf.name}-${index}-body`}
                  label={`${pf.itemLabel} ${index + 1}: texto`}
                  value={pair.body}
                  max={pf.bodyMax}
                  multiline
                  required
                  errors={errors[`${pf.name}.${index}.body`]}
                  onChange={(value) => setField(pf.name, pairs.map((p, i) => (i === index ? { ...p, body: value } : p)))}
                />
                {pairs.length > pf.minItems && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="self-start"
                    onClick={() => setField(pf.name, pairs.filter((_, i) => i !== index))}
                  >
                    Quitar {pf.itemLabel.toLowerCase()} {index + 1}
                  </Button>
                )}
              </div>
            ))}
            {pairs.length < pf.maxItems && (
              <Button
                type="button"
                variant="secondary"
                className="self-start"
                onClick={() => setField(pf.name, [...pairs, { title: "", body: "" }])}
              >
                Agregar {pf.itemLabel.toLowerCase()}
              </Button>
            )}
          </fieldset>
        );
      })}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Guardar sección"}
      </Button>
    </form>
  );
}
