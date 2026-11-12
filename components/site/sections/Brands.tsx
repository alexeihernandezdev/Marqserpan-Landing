import type { CSSProperties } from "react";
import Image from "next/image";

// Fabricantes cuyos equipos distribuimos. Logos en public/brand/marcas (alto 160 px, fondo transparente).
const SUPPLIERS = [
  { name: "Swedlinghaus", src: "/brand/marcas/swedlinghaus.webp", width: 309 },
  { name: "Magister Sistema Caffè", src: "/brand/marcas/magister.webp", width: 516 },
  { name: "Forni Fiorini", src: "/brand/marcas/fiorini.webp", width: 660 },
  { name: "Pietroberto", src: "/brand/marcas/pietroberto.webp", width: 662 },
];

/** Autoridad de la guía: marcas que distribuimos + fabricación propia. */
export function Brands() {
  return (
    <section id="marcas" aria-labelledby="marcas-title" className="bg-hueso pb-20 sm:pb-28">
      <div className="container-page">
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <div className="reveal flex flex-col justify-center rounded-3xl bg-carbon p-7 text-white sm:p-8">
            <p className="eyebrow mb-4 text-verde-400">Fabricación propia</p>
            <div className="flex items-center gap-3">
              <Image src="/brand/engranajes.webp" alt="" width={48} height={48} className="size-12 shrink-0" />
              <span className="flex flex-col leading-none">
                <span className="text-xs font-bold text-verde-400">Distribuidora</span>
                <span className="font-brand text-3xl">MAQSERPAN</span>
              </span>
            </div>
            <p className="mt-5 text-neutral-300">
              También fabricamos: equipos a la medida de tu negocio y los repuestos que no se consiguen.
            </p>
          </div>

          <div className="reveal rounded-3xl bg-white p-7 ring-1 ring-black/5 sm:p-8">
            <h2 id="marcas-title" className="text-xl text-carbon sm:text-2xl">
              Distribuimos equipos de marcas reconocidas
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SUPPLIERS.map((brand, i) => (
                <li
                  key={brand.name}
                  className="brand-shine flex h-24 items-center justify-center rounded-2xl border border-neutral-200 px-4"
                  style={{ "--shine-delay": `${i * 0.35}s` } as CSSProperties}
                >
                  <Image
                    src={brand.src}
                    alt={brand.name}
                    width={brand.width}
                    height={160}
                    sizes="160px"
                    className="max-h-12 w-auto max-w-full object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
