import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

type HeaderProps = {
  ctaLabel: string;
  /** Texto del enlace al catálogo; null cuando no hay productos que mostrar. */
  catalogLabel: string | null;
};

/** Cabecera fija: marca + enlace al catálogo + CTA directo siempre visible (FR-003). */
export function Header({ ctaLabel, catalogLabel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/brand/engranajes.webp"
            alt="Distribuidora Maqserpan"
            width={40}
            height={40}
            priority
            className="size-10 shrink-0"
          />
          <span aria-hidden="true" className="hidden min-w-0 flex-col leading-none min-[400px]:flex">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-verde-700">Distribuidora</span>
            <span className="font-eyebrow text-xl text-azul-700">MAQSERPAN</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex shrink-0 items-center gap-1 sm:gap-3">
          {/* En móvil no cabe junto al catálogo y el CTA; ahí el logo ya lleva al inicio. */}
          <Link
            href="/"
            className="hidden rounded-full px-4 py-2 text-base font-bold text-carbon transition-colors hover:text-verde-700 sm:block"
          >
            Inicio
          </Link>
          {catalogLabel && (
            <Link
              href="/catalogo"
              className="rounded-full px-2.5 py-2 text-sm font-bold text-carbon transition-colors hover:text-verde-700 sm:px-4 sm:text-base"
            >
              {/* En móvil el texto largo no cabe junto al logo y el CTA. */}
              <span className="sm:hidden">Catálogo</span>
              <span className="hidden sm:inline">{catalogLabel}</span>
            </Link>
          )}
          <ButtonLink href="/#cotizar" size="md" className="shrink-0">
            {ctaLabel}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
