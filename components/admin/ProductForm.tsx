"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { saveProduct } from "@/app/admin/(panel)/productos/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { type ActionState, idleState } from "@/lib/forms/action-state";
import { FormMessage } from "./FormMessage";

type Props = {
  categories: { id: string; name: string }[];
  product?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    shortDescription: string;
    description: string | null;
    isFeatured: boolean;
    isVisible: boolean;
  };
  initialMessage?: string;
};

export function ProductForm({ categories, product, initialMessage }: Props) {
  const initial: ActionState = initialMessage ? { status: "success", message: initialMessage } : idleState;
  const [state, formAction, pending] = useActionState(saveProduct, initial);
  const [values, setValues] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    isFeatured: product?.isFeatured ?? false,
    isVisible: product?.isVisible ?? false,
  });
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const set = (key: keyof typeof values) => (value: string | boolean) => setValues((v) => ({ ...v, [key]: value }));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <FormMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nombre" required errors={errors.name}>
          {(d) => (
            <Input id="name" name="name" value={values.name} onChange={(e) => set("name")(e.target.value)} aria-describedby={d} aria-invalid={errors.name ? true : undefined} maxLength={120} required />
          )}
        </Field>
        <Field id="categoryId" label="Categoría" required errors={errors.categoryId}>
          {(d) => (
            <Select id="categoryId" name="categoryId" value={values.categoryId} onChange={(e) => set("categoryId")(e.target.value)} aria-describedby={d} aria-invalid={errors.categoryId ? true : undefined} required>
              <option value="">Elige una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field
        id="shortDescription"
        label="Descripción corta"
        required
        hint={`Se ve en la tarjeta del catálogo. ${values.shortDescription.length}/200`}
        errors={errors.shortDescription}
      >
        {(d) => (
          <Input id="shortDescription" name="shortDescription" value={values.shortDescription} onChange={(e) => set("shortDescription")(e.target.value)} aria-describedby={d} aria-invalid={errors.shortDescription ? true : undefined} maxLength={200} required />
        )}
      </Field>

      <Field id="description" label="Descripción" hint="Se ve en la ficha del producto. Sin precios." errors={errors.description}>
        {(d) => (
          <Textarea id="description" name="description" rows={6} value={values.description} onChange={(e) => set("description")(e.target.value)} aria-describedby={d} maxLength={5000} />
        )}
      </Field>

      <Field id="slug" label="Enlace" hint="Se genera del nombre si lo dejas vacío. Ej. rebanadora-300" errors={errors.slug}>
        {(d) => (
          <Input id="slug" name="slug" value={values.slug} onChange={(e) => set("slug")(e.target.value)} aria-describedby={d} maxLength={120} />
        )}
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-bold">Publicación</legend>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="isFeatured" checked={values.isFeatured} onChange={(e) => set("isFeatured")(e.target.checked)} className="size-5 accent-verde-700" />
          Destacado
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="isVisible" checked={values.isVisible} onChange={(e) => set("isVisible")(e.target.checked)} className="size-5 accent-verde-700" aria-describedby={errors.isVisible ? "isVisible-error" : undefined} />
          Visible en la landing
        </label>
        {errors.isVisible && (
          <p id="isVisible-error" className="text-sm font-bold text-red-700">
            {errors.isVisible[0]}
          </p>
        )}
      </fieldset>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Guardar producto"}
      </Button>
    </form>
  );
}
