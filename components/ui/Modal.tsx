"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";

type ModalProps = { labelledBy: string; children: ReactNode };

/**
 * Ventana accesible sobre la página (ruta interceptada). Usa <dialog> nativo: atrapa el foco,
 * cierra con Escape y devuelve al visitante a donde estaba con router.back().
 */
export function Modal({ labelledBy, children }: ModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        router.back();
      }}
      onClick={(event) => {
        // Clic en el fondo (fuera del contenido) cierra la ventana.
        if (event.target === dialogRef.current) router.back();
      }}
      className="m-auto max-h-[92dvh] w-[min(100%-1rem,64rem)] overflow-y-auto rounded-lg bg-white p-0 text-carbon shadow-2xl backdrop:bg-carbon/70"
    >
      <div className="sticky top-0 z-10 flex justify-end bg-white/90 p-2 backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-11 items-center justify-center rounded-full hover:bg-hueso"
          aria-label="Cerrar"
        >
          <CloseIcon className="size-6" />
        </button>
      </div>
      <div className="px-5 pb-8 sm:px-8">{children}</div>
    </dialog>
  );
}
