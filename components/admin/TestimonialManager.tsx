"use client";

import { startTransition, useActionState, useState } from "react";
import { deleteTestimonial, reorderTestimonials, saveTestimonial } from "@/app/admin/(panel)/testimonios/actions";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { idleState } from "@/lib/forms/action-state";
import { ConfirmButton } from "./ConfirmButton";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { MoveButtons } from "./MoveButtons";
import { SwitchField } from "./SwitchField";

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
      <FormField id={`${prefix}quote`} label="Testimonio" required hint="Lo que el cliente dijo, con sus palabras." errors={errors.quote}>
        {(d) => (
          <Textarea id={`${prefix}quote`} name="quote" defaultValue={testimonial?.quote} maxLength={400} aria-describedby={d} aria-invalid={errors.quote ? true : undefined} required />
        )}
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id={`${prefix}authorName`} label="Nombre del cliente" required errors={errors.authorName}>
          {(d) => <Input id={`${prefix}authorName`} name="authorName" defaultValue={testimonial?.authorName} maxLength={80} aria-describedby={d} aria-invalid={errors.authorName ? true : undefined} required />}
        </FormField>
        <FormField id={`${prefix}businessName`} label="Negocio">
          {(d) => <Input id={`${prefix}businessName`} name="businessName" defaultValue={testimonial?.businessName ?? ""} maxLength={120} aria-describedby={d} />}
        </FormField>
        <FormField id={`${prefix}city`} label="Ciudad">
          {(d) => <Input id={`${prefix}city`} name="city" defaultValue={testimonial?.city ?? ""} maxLength={80} aria-describedby={d} />}
        </FormField>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SwitchField id={`${prefix}isVisible`} name="isVisible" label="Visible en la landing" defaultChecked={testimonial?.isVisible ?? true} />
        <Button type="submit" disabled={pending}>
          {submitLabel}
        </Button>
      </div>
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
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <Card className="items-center py-10 text-center text-sm text-muted-foreground">
          Aún no hay testimonios. Mientras no haya ninguno visible, la sección no aparece en la landing.
        </Card>
      )}
      <ul className="flex flex-col gap-4">
        {items.map((testimonial, index) => (
          <li key={testimonial.id}>
            <Card className="gap-4">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MoveButtons
                    name="testimonio"
                    first={index === 0}
                    last={index === items.length - 1}
                    onMove={(delta) => move(index, delta)}
                    className="flex-row"
                  />
                  <CardTitle className="text-sm text-muted-foreground">{testimonial.authorName}</CardTitle>
                </div>
                <ConfirmButton
                  label="Borrar"
                  question="¿Borrar este testimonio?"
                  onConfirm={async () => {
                    await deleteTestimonial(testimonial.id);
                    setItems((list) => list.filter((t) => t.id !== testimonial.id));
                  }}
                />
              </CardHeader>
              <CardContent>
                <TestimonialForm testimonial={testimonial} submitLabel="Guardar cambios" />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fuera de la lista: así su mensaje de confirmación no se pierde cuando la lista se actualiza. */
export function NewTestimonial() {
  return (
    <Card className="gap-4 border-dashed">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl">Nuevo testimonio</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TestimonialForm submitLabel="Agregar testimonio" />
      </CardContent>
    </Card>
  );
}
