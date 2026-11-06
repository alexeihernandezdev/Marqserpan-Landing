import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthCard title="Entrar al panel" description="Solo para el equipo de Distribuidora Maqserpan.">
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-5 text-center text-sm">
        <Link href="/admin/recuperar" className="font-medium text-primary underline-offset-4 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </AuthCard>
  );
}
