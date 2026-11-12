"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

// Fotos en Cloudinary (maqserpan/restauraciones, 1200×1600): «<slug>-antes» y «<slug>-despues».
// El primero va destacado en grande.
const RESTORATIONS = [
  {
    slug: "horno",
    name: "Horno rotativo de 40 bandejas",
    body: "Recuperamos la estructura y renovamos paneles, puerta, tablero, resistencias y turbina. Volvió a hornear en la panadería.",
  },
  { slug: "carro", name: "Carro portabandejas" },
  { slug: "extension", name: "Extensión de mano mecánica" },
  { slug: "molino", name: "Molino de café" },
  { slug: "formadora", name: "Formadora de pan" },
  { slug: "rodillo", name: "Rodillo de madera" },
  { slug: "rebanadora", name: "Rebanadora de charcutería" },
];

type Restoration = (typeof RESTORATIONS)[number] & { body?: string };
type Stage = "antes" | "despues";

const INTERVAL_MS = 4500;
const MOVE_MS = 800;
// Desfase entre tarjetas para que el cambio recorra el mosaico en cascada.
const STAGGER_MS = 90;

const LABEL: Record<Stage, string> = { antes: "Antes", despues: "Después" };

/** Alterna antes/después mientras la sección está en pantalla; quieto si el usuario pide menos movimiento. */
function useAlternating() {
  const ref = useRef<HTMLUListElement>(null);
  const [showBefore, setShowBefore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setShowBefore((v) => !v), INTERVAL_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return { ref, showBefore };
}

function Photo({
  item,
  stage,
  large,
  big,
  delay,
}: {
  item: Restoration;
  stage: Stage;
  large: boolean;
  big: boolean;
  delay: number;
}) {
  // Miniatura en la esquina (3:4) o a todo el tamaño de la tarjeta. Se anima la caja, no la imagen.
  const thumb = big ? { width: "10rem", height: "13.333rem" } : { width: "6rem", height: "8rem" };
  const style: CSSProperties = {
    ...(large ? { top: 0, right: 0, width: "100%", height: "100%" } : { top: "1rem", right: "1rem", ...thumb }),
    // A media animación se intercambia el apilado: la que se encoge queda encima de la que crece.
    zIndex: large ? 10 : 20,
    transition: [
      ...["top", "right", "width", "height", "border-radius", "box-shadow"].map(
        (prop) => `${prop} ${MOVE_MS}ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms`,
      ),
      `z-index 0s linear ${delay + MOVE_MS / 2}ms`,
    ].join(", "),
  };
  return (
    <figure
      style={style}
      className={`absolute overflow-hidden ${large ? "rounded-none" : "rounded-2xl shadow-2xl ring-2 ring-white"}`}
    >
      <Image
        src={`maqserpan/restauraciones/${item.slug}-${stage}`}
        alt={`${item.name} ${stage === "antes" ? "antes" : "después"} de la restauración`}
        fill
        sizes={big ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"}
        className="object-cover"
      />
      <figcaption
        className={`absolute inset-x-0 bottom-0 bg-carbon/85 py-1 text-center text-xs font-bold text-white transition-opacity duration-300 ${large ? "opacity-0" : "opacity-100"}`}
      >
        {LABEL[stage]}
      </figcaption>
    </figure>
  );
}

function Card({ item, index, showBefore, big = false, wide = false }: { item: Restoration; index: number; showBefore: boolean; big?: boolean; wide?: boolean }) {
  const delay = index * STAGGER_MS;
  const largeStage: Stage = showBefore ? "antes" : "despues";
  return (
    <li
      className={`reveal relative overflow-hidden rounded-3xl bg-carbon-800 ring-1 ring-white/10 ${big ? "min-h-[520px] sm:col-span-2 lg:row-span-2" : "min-h-[340px]"} ${wide ? "lg:col-span-2" : ""}`}
    >
      <Photo item={item} stage="despues" large={!showBefore} big={big} delay={delay} />
      <Photo item={item} stage="antes" large={showBefore} big={big} delay={delay} />
      <div className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-30 p-6">
        {/* Las dos etiquetas superpuestas; se cruzan a mitad del cambio de foto. */}
        <span className="grid">
          {(["despues", "antes"] as const).map((stage) => (
            <span
              key={stage}
              aria-hidden={stage !== largeStage}
              style={{ transitionDelay: `${delay + MOVE_MS / 2}ms` }}
              className={`col-start-1 row-start-1 w-fit rounded-full px-3 py-1 text-sm font-bold text-white transition-[opacity,translate] duration-300 ${stage === "antes" ? "bg-carbon ring-1 ring-white/30" : "bg-brand-gradient"} ${stage === largeStage ? "opacity-100" : "translate-y-1.5 opacity-0"}`}
            >
              {LABEL[stage]}
            </span>
          ))}
        </span>
        <h3 className={`mt-3 text-white ${big ? "text-3xl" : "text-xl"}`}>{item.name}</h3>
        {big && item.body && <p className="mt-2 max-w-md text-neutral-300">{item.body}</p>}
      </div>
    </li>
  );
}

/** Mosaico de restauraciones: la foto grande alterna entre el antes y el después. */
export function RestorationsMosaic() {
  const { ref, showBefore } = useAlternating();
  const [featured, ...rest] = RESTORATIONS;
  return (
    <ul ref={ref} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card item={featured} index={0} showBefore={showBefore} big />
      {/* Los dos últimos completan la tercera fila a media anchura. */}
      {rest.map((item, i) => (
        <Card key={item.slug} item={item} index={i + 1} showBefore={showBefore} wide={i >= rest.length - 2} />
      ))}
    </ul>
  );
}
