"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderProducts, setProductFlag } from "@/app/admin/(panel)/productos/actions";
import { Badge } from "@/components/shadcn/badge";
import { Card } from "@/components/shadcn/card";
import { Label } from "@/components/shadcn/label";
import { Switch } from "@/components/shadcn/switch";
import { Notice } from "./FormMessage";
import { MoveButtons } from "./MoveButtons";

type Item = {
  id: string;
  name: string;
  categoryName: string;
  brand: string | null;
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
    return (
      <Card className="items-center py-10 text-center text-sm text-muted-foreground">
        Aún no hay productos. Crea el primero.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <Notice tone="error">{error}</Notice>}
      <Card className="py-0">
        <ul className="divide-y">
          {items.map((product, index) => (
            <li key={product.id} className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4">
              <MoveButtons name={product.name} first={index === 0} last={index === items.length - 1} onMove={(delta) => move(index, delta)} />
              <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                {product.cover ? (
                  <Image src={product.cover} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/productos/${product.id}`} className="font-semibold underline-offset-4 hover:underline">
                  {product.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline">{product.categoryName}</Badge>
                  {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
                  <span>
                    {product.imageCount} {product.imageCount === 1 ? "foto" : "fotos"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`visible-${product.id}`}
                    checked={product.isVisible}
                    onCheckedChange={(checked) => toggle(product.id, "isVisible", checked)}
                  />
                  <Label htmlFor={`visible-${product.id}`} className="font-normal">
                    Visible
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id={`featured-${product.id}`}
                    checked={product.isFeatured}
                    onCheckedChange={(checked) => toggle(product.id, "isFeatured", checked)}
                  />
                  <Label htmlFor={`featured-${product.id}`} className="font-normal">
                    Destacado
                  </Label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
