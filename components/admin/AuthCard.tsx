import Image from "next/image";
import type { ReactNode } from "react";

type Props = { title?: string; description?: string; children: ReactNode };

/**
 * Tarjeta centrada de las páginas sin sesión del admin (login y restablecer contraseña).
 * Sin title, los hijos ponen su propio encabezado (cuando depende de datos dinámicos).
 */
export function AuthCard({ title, description, children }: Props) {
  return (
    <main className="flex flex-1 items-center justify-center bg-hueso px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <Image src="/brand/engranajes.webp" alt="Distribuidora Maqserpan" width={48} height={48} className="mb-4 size-12" />
        {title ? (
          <>
            <h1 className="text-2xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-gris">{description}</p>}
            <div className="mt-6">{children}</div>
          </>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
