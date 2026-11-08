"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Lista cuyas tarjetas (.spotlight-card) iluminan su borde donde está el cursor. Sin cursor
 * encima (o en táctiles), la luz recorre sola cada tarjeta mientras la lista está en pantalla.
 * Solo escribe --x/--y en cada tarjeta; el efecto visual vive en globals.css.
 */
export function SpotlightList(props: ComponentProps<"ul">) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const cards = () => list.querySelectorAll<HTMLElement>(".spotlight-card");

    let pointerInside = false;
    let visible = false;
    let frame = 0;
    let start = 0;

    function followPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointerInside = true;
      for (const card of cards()) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--y", `${event.clientY - rect.top}px`);
      }
    }

    function release() {
      pointerInside = false;
    }

    // Recorrido automático: cada tarjeta con su propio desfase para que no se muevan al unísono.
    function wander(time: number) {
      start ||= time;
      const t = (time - start) / 1000;
      if (!pointerInside) {
        cards().forEach((card, i) => {
          card.style.setProperty("--x", `${((Math.sin(t * 0.7 + i * 0.9) + 1) / 2) * 100}%`);
          card.style.setProperty("--y", `${((Math.cos(t * 1.05 + i) + 1) / 2) * 100}%`);
        });
      }
      frame = requestAnimationFrame(wander);
    }

    function sync() {
      cancelAnimationFrame(frame);
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(wander);
    }

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(list);
    reducedMotion.addEventListener("change", sync);
    list.addEventListener("pointermove", followPointer);
    list.addEventListener("pointerleave", release);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      list.removeEventListener("pointermove", followPointer);
      list.removeEventListener("pointerleave", release);
    };
  }, []);

  return <ul ref={ref} {...props} />;
}
