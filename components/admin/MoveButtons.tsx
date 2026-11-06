import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";

type Props = {
  /** Nombre del elemento para las etiquetas: «Subir {name}». */
  name: string;
  first: boolean;
  last: boolean;
  onMove: (delta: -1 | 1) => void;
  className?: string;
};

/** Flechas accesibles para cambiar el orden de una lista. */
export function MoveButtons({ name, first, last, onMove, className }: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onMove(-1)} disabled={first} aria-label={`Subir ${name}`}>
        <ChevronUp />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onMove(1)} disabled={last} aria-label={`Bajar ${name}`}>
        <ChevronDown />
      </Button>
    </div>
  );
}
