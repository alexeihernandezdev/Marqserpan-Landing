import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  /** Junto al título, fuera del <h1> (p. ej. un estado). */
  badge?: ReactNode;
  /** Botones o enlaces a la derecha del título. */
  actions?: ReactNode;
};

/** Encabezado común de las páginas del panel. */
export function PageHeader({ title, description, back, badge, actions }: Props) {
  return (
    <header className="flex flex-col gap-3">
      {back && (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl">{title}</h1>
            {badge}
          </div>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
