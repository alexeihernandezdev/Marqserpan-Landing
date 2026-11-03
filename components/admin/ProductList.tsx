"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderProducts, setProductFlag } from "@/app/admin/(panel)/productos/actions";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

type Item = {
  id: string;
  name: string;
  categoryName: string;
  isFeatured: boolean;
  isVisible: boolean;
  cover: string | null;
  imageCount: number;
};

/** Lista de productos con interruptores de visible/destacado y orden con flechas accesibles. */
export function ProductList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(id: string, flag: "isVisible" | "isFeatured", value: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await setProductFlag(id, flag, value);
      if (result.ok) setItems((list) => list.map((p) => (p.id === id ? { ...p, [flag]: value } : p)));
      else setError(result.message);
    });
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(() => reorderProducts(next.map((p) => p.id)));
  }

  if (items.length === 0) {
    return <p className="rounded-lg bg-white p-6 text-gris">Aún no hay productos. Crea el primero.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {items.map((product, index) => (
          <li key={product.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Subir ${product.name}`}
                className="flex size-8 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Bajar ${product.name}`}
                className="flex size-8 rotate-90 items-center justify-center rounded hover:bg-hueso disabled:opacity-30"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
            <div className="relative size-16 shrink-0 overflow-hidden rounded bg-hueso">
              {product.cover && <Image src={product.cover} alt="" fill sizes="64px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/productos/${product.id}`} className="font-bold underline-offset-4 hover:underline">
                {product.name}
              </Link>
              <p className="text-sm text-gris">
                {product.categoryName} · {product.imageCount} {product.imageCount === 1 ? "foto" : "fotos"}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product.isVisible}
                onChange={(e) => toggle(product.id, "isVisible", e.target.checked)}
                className="size-5 accent-verde-700"
              />
              Visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={product.isFeatured}
                onChange={(e) => toggle(product.id, "isFeatured", e.target.checked)}
                className="size-5 accent-verde-700"
              />
              Destacado
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
