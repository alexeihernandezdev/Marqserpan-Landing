import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";
import { isPasswordResetTokenValid } from "@/lib/auth/password-reset";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
  // El token va en la URL: que no viaje a otros sitios en el Referer.
  referrer: "no-referrer",
};

/** Lee el token de la URL: queda dentro de <Suspense> (Cache Components). */
async function ResetContent({ searchParams }: Pick<PageProps<"/admin/restablecer">, "searchParams">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && (await isPasswordResetTokenValid(token));

  if (!valid) {
    return (
      <>
        <h1 className="text-2xl">Enlace no válido</h1>
        <p className="mt-1 text-sm text-gris">El enlace venció (dura 1 hora) o ya se usó.</p>
        <Link href="/admin/recuperar" className="mt-6 inline-block font-bold underline">
          Pedir un enlace nuevo
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl">Nueva contraseña</h1>
      <p className="mt-1 text-sm text-gris">Al guardarla se cierran las sesiones abiertas.</p>
      <div className="mt-6">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/admin/restablecer">) {
  return (
    <AuthCard>
      <Suspense fallback={<p className="text-gris">Cargando…</p>}>
        <ResetContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
