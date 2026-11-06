"use client";

import { Plus } from "lucide-react";
import { startTransition, useActionState, useState } from "react";
import { deleteCategory, reorderCategories, saveCategory } from "@/app/admin/(panel)/categorias/actions";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { type ActionState, idleState } from "@/lib/forms/action-state";
import { ConfirmButton } from "./ConfirmButton";
import { FormMessage } from "./FormMessage";
import { MoveButtons } from "./MoveButtons";

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
    <li className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4">
      <MoveButtons name={category.name} first={first} last={last} onMove={onMove} />
      <form action={formAction} className="flex flex-1 flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={category.id} />
        <label className="sr-only" htmlFor={`cat-${category.id}`}>
          Nombre de la categoría
        </label>
        <Input id={`cat-${category.id}`} name="name" defaultValue={category.name} maxLength={60} className="max-w-xs" />
        <Button type="submit" variant="outline" disabled={pending}>
          Guardar
        </Button>
        <Badge variant="secondary" className="border-border">
          {category.productCount} {category.productCount === 1 ? "producto" : "productos"}
        </Badge>
        {state.status === "error" && <span className="text-sm font-medium text-destructive">{state.message}</span>}
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
    <div className="flex flex-col gap-4">
      <FormMessage state={result} />
      {categories.length > 0 && (
        <Card className="py-0">
          <ul className="divide-y">
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
        </Card>
      )}
    </div>
  );
}

/** Fuera de la lista: así su mensaje no se pierde cuando la lista se actualiza. */
export function NewCategory() {
  const [state, formAction, pending] = useActionState(saveCategory, idleState);
  return (
    <div className="flex flex-col gap-3">
      <FormMessage state={state} />
      <Card className="border-dashed py-5">
        <CardContent>
          <form action={formAction} className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-category" className="font-semibold">
                Nueva categoría
              </Label>
              <Input id="new-category" name="name" maxLength={60} required className="w-72 max-w-full" />
            </div>
            <Button type="submit" disabled={pending}>
              <Plus /> Agregar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
