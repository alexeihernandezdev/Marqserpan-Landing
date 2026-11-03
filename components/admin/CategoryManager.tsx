"use client";

import { startTransition, useActionState, useState } from "react";
import { deleteCategory, reorderCategories, saveCategory } from "@/app/admin/(panel)/categorias/actions";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { type ActionState, idleState } from "@/lib/forms/action-state";
import { ConfirmButton } from "./ConfirmButton";
import { FormMessage } from "./FormMessage";

type Category = { id: string; name: string; productCount: number };

function CategoryRow({
  category,
  onMove,
  first,
  last,
  onResult,
}: {
  category: Category;
  onMove: (delta: -1 | 1) => void;
  first: boolean;
  last: boolean;
  onResult: (state: ActionState) => void;
}) {
  const [state, formAction, pending] = useActionState(saveCategory, idleState);
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
      <div className="flex">
        <button type="button" onClick={() => onMove(-1)} disabled={first} aria-label={`Subir ${category.name}`} className="flex size-9 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30">
          <ChevronLeftIcon className="size-4" />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={last} aria-label={`Bajar ${category.name}`} className="flex size-9 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30">
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <form action={formAction} className="flex flex-1 flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={category.id} />
        <label className="sr-only" htmlFor={`cat-${category.id}`}>
          Nombre de la categoría
        </label>
        <Input id={`cat-${category.id}`} name="name" defaultValue={category.name} maxLength={60} className="max-w-xs" />
        <Button type="submit" variant="secondary" disabled={pending}>
          Guardar
        </Button>
        <span className="text-sm text-gris">
          {category.productCount} {category.productCount === 1 ? "producto" : "productos"}
        </span>
        {state.status === "error" && <span className="text-sm font-bold text-red-700">{state.message}</span>}
      </form>
      <ConfirmButton
        label="Borrar"
        question={`¿Borrar «${category.name}»?`}
        onConfirm={async () => onResult(await deleteCategory(category.id))}
      />
    </li>
  );
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [result, setResult] = useState<ActionState>(idleState);

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    startTransition(() => reorderCategories(next.map((c) => c.id)));
  }

  return (
    <div className="flex flex-col gap-6">
      <FormMessage state={result} />
      <ul className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            first={index === 0}
            last={index === categories.length - 1}
            onMove={(delta) => move(index, delta)}
            onResult={(state) => {
              setResult(state);
              if (state.status === "success") setCategories((list) => list.filter((c) => c.id !== category.id));
            }}
          />
        ))}
      </ul>
    </div>
  );
}

/** Fuera de la lista: así su mensaje no se pierde cuando la lista se actualiza. */
export function NewCategory() {
  const [state, formAction, pending] = useActionState(saveCategory, idleState);
  return (
    <div className="flex flex-col gap-3">
      <FormMessage state={state} />
      <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-lg bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm font-bold">
          Nueva categoría
          <Input name="name" maxLength={60} required className="max-w-xs" />
        </label>
        <Button type="submit" disabled={pending}>
          Agregar
        </Button>
      </form>
    </div>
  );
}
