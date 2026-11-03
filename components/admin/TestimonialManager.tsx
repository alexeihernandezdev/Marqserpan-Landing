"use client";

import { startTransition, useActionState, useState } from "react";
import { deleteTestimonial, reorderTestimonials, saveTestimonial } from "@/app/admin/(panel)/testimonios/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { idleState } from "@/lib/forms/action-state";
import { ConfirmButton } from "./ConfirmButton";
import { FormMessage } from "./FormMessage";

type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  businessName: string | null;
  city: string | null;
  isVisible: boolean;
};

function TestimonialForm({ testimonial, submitLabel }: { testimonial?: Testimonial; submitLabel: string }) {
  const [state, formAction, pending] = useActionState(saveTestimonial, idleState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const prefix = testimonial ? `t-${testimonial.id}-` : "nuevo-";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
      <FormMessage state={state} />
      <Field id={`${prefix}quote`} label="Testimonio" required hint="Lo que el cliente dijo, con sus palabras." errors={errors.quote}>
        {(d) => (
          <Textarea id={`${prefix}quote`} name="quote" defaultValue={testimonial?.quote} maxLength={400} aria-describedby={d} required />
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id={`${prefix}authorName`} label="Nombre del cliente" required errors={errors.authorName}>
          {(d) => <Input id={`${prefix}authorName`} name="authorName" defaultValue={testimonial?.authorName} maxLength={80} aria-describedby={d} required />}
        </Field>
        <Field id={`${prefix}businessName`} label="Negocio">
          {(d) => <Input id={`${prefix}businessName`} name="businessName" defaultValue={testimonial?.businessName ?? ""} maxLength={120} aria-describedby={d} />}
        </Field>
        <Field id={`${prefix}city`} label="Ciudad">
          {(d) => <Input id={`${prefix}city`} name="city" defaultValue={testimonial?.city ?? ""} maxLength={80} aria-describedby={d} />}
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="isVisible" defaultChecked={testimonial?.isVisible ?? true} className="size-5 accent-verde-700" />
        Visible en la landing
      </label>
      <Button type="submit" disabled={pending} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export function TestimonialManager({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(() => reorderTestimonials(next.map((t) => t.id)));
  }

  return (
    <div className="flex flex-col gap-6">
      {items.length === 0 && (
        <p className="rounded-lg bg-white p-4 text-gris">
          Aún no hay testimonios. Mientras no haya ninguno visible, la sección no aparece en la landing.
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {items.map((testimonial, index) => (
          <li key={testimonial.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir testimonio" className="flex size-9 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30">
                  <ChevronLeftIcon className="size-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Bajar testimonio" className="flex size-9 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30">
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
              <ConfirmButton
                label="Borrar"
                question="¿Borrar este testimonio?"
                onConfirm={async () => {
                  await deleteTestimonial(testimonial.id);
                  setItems((list) => list.filter((t) => t.id !== testimonial.id));
                }}
              />
            </div>
            <TestimonialForm testimonial={testimonial} submitLabel="Guardar cambios" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fuera de la lista: así su mensaje de confirmación no se pierde cuando la lista se actualiza. */
export function NewTestimonial() {
  return (
    <section className="rounded-lg border-2 border-dashed border-neutral-300 bg-white p-5">
      <h2 className="mb-4 text-xl">Nuevo testimonio</h2>
      <TestimonialForm submitLabel="Agregar testimonio" />
    </section>
  );
}
