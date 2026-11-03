import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

type HeaderProps = { ctaLabel: string };

/** Cabecera fija: marca + CTA directo siempre visible (FR-003). */
export function Header({ ctaLabel }: HeaderProps) {
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
            <span className="font-display text-lg text-azul-700">MAQSERPAN</span>
          </span>
        </Link>
        <ButtonLink href="/#cotizar" size="md" className="shrink-0">
          {ctaLabel}
        </ButtonLink>
      </div>
    </header>
  );
}
