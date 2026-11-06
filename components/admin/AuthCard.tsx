import Image from "next/image";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/shadcn/card";

type Props = { title?: string; description?: string; children: ReactNode };

/**
 * Tarjeta centrada de las páginas sin sesión del admin (login y restablecer contraseña).
 * Sin title, los hijos ponen su propio encabezado (cuando depende de datos dinámicos).
 */
export function AuthCard({ title, description, children }: Props) {
  return (
    <main className="admin-ui flex flex-1 items-center justify-center bg-hueso px-4 py-12">
      <Card className="w-full max-w-sm gap-0 py-8">
        <CardContent className="px-6 sm:px-8">
          <Image src="/brand/engranajes.webp" alt="Distribuidora Maqserpan" width={48} height={48} className="mb-5 size-12" />
          {title ? (
            <>
              <h1 className="text-2xl">{title}</h1>
              {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
              <div className="mt-6">{children}</div>
            </>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </main>
  );
}
