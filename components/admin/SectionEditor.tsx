"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { saveSection } from "@/app/admin/(panel)/contenido/actions";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import type { EditorField } from "@/lib/content/editor-fields";
import { idleState } from "@/lib/forms/action-state";
import { detectPriceOrDeadline } from "@/lib/validation/price-warning";
import { FormField } from "./FormField";
import { FormMessage, Notice } from "./FormMessage";
import { CharCount } from "./ProductForm";

type Pair = { title: string; body: string };
type Data = Record<string, string | string[] | Pair[]>;

type Props = { sectionKey: string; fields: EditorField[]; initialData: Data };

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
  return (
    <FormField id={id} label={label} required={required} hint={hint} errors={errors} aside={<CharCount value={value} max={max} />}>
      {(describedBy) => {
        const props = {
          id,
          value,
          onChange: (e: { target: { value: string } }) => onChange(e.target.value),
          "aria-invalid": errors ? true : undefined,
          "aria-describedby": describedBy,
          required,
        };
        return multiline ? <Textarea rows={3} {...props} /> : <Input {...props} />;
      }}
    </FormField>
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
        <Notice tone="warning">
          <span>
            <strong>Atención:</strong> parece que el texto incluye un precio o un plazo fijo. La landing no publica
            precios ni plazos: cada pedido se cotiza. Puedes guardar igual si es correcto.
          </span>
        </Notice>
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
            <fieldset key={field.name} className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
              <legend className="px-1 text-sm font-semibold">
                {field.label}{" "}
                <span className="font-normal text-muted-foreground">
                  ({field.minItems === field.maxItems ? field.maxItems : `${field.minItems}–${field.maxItems}`})
                </span>
              </legend>
              {errors[field.name] && <p className="text-sm font-medium text-destructive">{errors[field.name]?.[0]}</p>}
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
                      size="icon"
                      onClick={() => setField(field.name, items.filter((_, i) => i !== index))}
                      aria-label={`Quitar ${field.itemLabel.toLowerCase()} ${index + 1}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
              {items.length < field.maxItems && (
                <Button type="button" variant="outline" className="self-start" onClick={() => setField(field.name, [...items, ""])}>
                  <Plus /> Agregar {field.itemLabel.toLowerCase()}
                </Button>
              )}
            </fieldset>
          );
        }

        if (field.kind !== "pairs") return null;
        const pf = field; // constante: conserva el tipo estrechado dentro de los closures
        const pairs = (data[pf.name] as Pair[]) ?? [];
        return (
          <fieldset key={pf.name} className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
            <legend className="px-1 text-sm font-semibold">{pf.label}</legend>
            {errors[pf.name] && <p className="text-sm font-medium text-destructive">{errors[pf.name]?.[0]}</p>}
            {pairs.map((pair, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-md border-l-4 border-amarillo bg-background p-4 shadow-xs">
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
                    size="sm"
                    className="self-start text-muted-foreground hover:text-destructive"
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
                variant="outline"
                className="self-start"
                onClick={() => setField(pf.name, [...pairs, { title: "", body: "" }])}
              >
                <Plus /> Agregar {pf.itemLabel.toLowerCase()}
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
