import { SectionCta } from "../SectionCta";
import { RestorationsMosaic } from "./RestorationsMosaic";
import { SectionHeading } from "./SectionHeading";

type Props = { ctaLabel: string };

/** Autoridad: equipos restaurados en nuestro taller, antes y después. */
export function Restorations({ ctaLabel }: Props) {
  return (
    <section
      id="restauraciones"
      aria-labelledby="restauraciones-title"
      className="bg-glow relative overflow-hidden py-20 text-white sm:py-28"
    >
      <div className="container-page relative">
        <SectionHeading
          id="restauraciones-title"
          eyebrow="Restauraciones"
          title="Si tiene arreglo, lo dejamos como nuevo"
          intro="En nuestro taller desarmamos, reparamos y dejamos tus equipos listos para trabajar. Así llegaron y así salieron."
          tone="dark"
        />
        <RestorationsMosaic />
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
