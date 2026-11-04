import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { ResetRequestForm } from "@/components/admin/ResetRequestForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return (
    <AuthCard title="Recuperar contraseña" description="Te enviamos por correo un enlace para elegir una nueva.">
      <ResetRequestForm />
      <p className="mt-5 text-center text-sm">
        <Link href="/admin/login" className="font-bold underline">
          Volver a entrar
        </Link>
      </p>
    </AuthCard>
  );
}
