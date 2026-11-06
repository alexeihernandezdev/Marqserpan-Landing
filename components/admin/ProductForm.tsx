"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { saveProduct } from "@/app/admin/(panel)/productos/actions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { type ActionState, idleState } from "@/lib/forms/action-state";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SwitchField } from "./SwitchField";

type Props = {
  categories: { id: string; name: string }[];
  /** Marcas ya usadas en otros productos, como sugerencias. */
  brands: string[];
  product?: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    categoryId: string;
    shortDescription: string;
    description: string | null;
    isFeatured: boolean;
    isVisible: boolean;
  };
  initialMessage?: string;
};

export function ProductForm({ categories, brands, product, initialMessage }: Props) {
  const initial: ActionState = initialMessage ? { status: "success", message: initialMessage } : idleState;
  const [state, formAction, pending] = useActionState(saveProduct, initial);
  const [values, setValues] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    brand: product?.brand ?? "",
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <FormMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" label="Nombre" required errors={errors.name}>
          {(d) => (
            <Input id="name" name="name" value={values.name} onChange={(e) => set("name")(e.target.value)} aria-describedby={d} aria-invalid={errors.name ? true : undefined} maxLength={120} required />
          )}
        </FormField>
        <FormField id="categoryId" label="Categoría" required errors={errors.categoryId}>
          {(d) => (
            <Select name="categoryId" value={values.categoryId} onValueChange={set("categoryId")} required>
              <SelectTrigger id="categoryId" aria-describedby={d} aria-invalid={errors.categoryId ? true : undefined} className="w-full">
                <SelectValue placeholder="Elige una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormField id="brand" label="Marca" hint="Elige una de la lista o escribe una nueva. Sirve para filtrar el catálogo." errors={errors.brand}>
        {(d) => (
          <>
            <Input id="brand" name="brand" list="brand-options" value={values.brand} onChange={(e) => set("brand")(e.target.value)} aria-describedby={d} aria-invalid={errors.brand ? true : undefined} maxLength={60} autoComplete="off" className="sm:max-w-sm" />
            <datalist id="brand-options">
              {brands.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </>
        )}
      </FormField>

      <FormField
        id="shortDescription"
        label="Descripción corta"
        required
        hint="Se ve en la tarjeta del catálogo."
        aside={<CharCount value={values.shortDescription} max={200} />}
        errors={errors.shortDescription}
      >
        {(d) => (
          <Input id="shortDescription" name="shortDescription" value={values.shortDescription} onChange={(e) => set("shortDescription")(e.target.value)} aria-describedby={d} aria-invalid={errors.shortDescription ? true : undefined} maxLength={200} required />
        )}
      </FormField>

      <FormField id="description" label="Descripción" hint="Se ve en la ficha del producto. Sin precios." errors={errors.description}>
        {(d) => (
          <Textarea id="description" name="description" rows={6} value={values.description} onChange={(e) => set("description")(e.target.value)} aria-describedby={d} maxLength={5000} />
        )}
      </FormField>

      <FormField id="slug" label="Enlace" hint="Se genera del nombre si lo dejas vacío. Ej. rebanadora-300" errors={errors.slug}>
        {(d) => (
          <Input id="slug" name="slug" value={values.slug} onChange={(e) => set("slug")(e.target.value)} aria-describedby={d} maxLength={120} className="font-mono" />
        )}
      </FormField>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold">Publicación</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <SwitchField
            id="isVisible"
            name="isVisible"
            label="Visible en la landing"
            description="Necesita al menos una foto."
            checked={values.isVisible}
            onCheckedChange={(checked) => set("isVisible")(checked)}
            error={errors.isVisible?.[0]}
          />
          <SwitchField
            id="isFeatured"
            name="isFeatured"
            label="Destacado"
            description="Aparece primero en el catálogo."
            checked={values.isFeatured}
            onCheckedChange={(checked) => set("isFeatured")(checked)}
          />
        </div>
      </fieldset>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Guardando…" : "Guardar producto"}
      </Button>
    </form>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs tabular-nums ${over ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
      {value.length}/{max}
    </span>
  );
}
