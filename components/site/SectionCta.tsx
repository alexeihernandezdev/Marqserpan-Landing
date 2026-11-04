import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

type SectionCtaProps = { label: string; align?: "start" | "center"; className?: string };

/** CTA directo al final de cada bloque: mismo texto y color que el de la cabecera (FR-003). */
export function SectionCta({ label, align = "start", className = "" }: SectionCtaProps) {
  return (
    <div className={`mt-12 flex ${align === "center" ? "justify-center" : "justify-start"} ${className}`}>
      <ButtonLink href="/#cotizar" size="lg" className="group">
        {label}
        <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
      </ButtonLink>
    </div>
  );
}
