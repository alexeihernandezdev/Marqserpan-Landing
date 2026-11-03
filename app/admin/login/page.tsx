import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-hueso px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <Image src="/brand/engranajes.webp" alt="Distribuidora Maqserpan" width={48} height={48} className="size-12" />
        <h1 className="mt-4 text-2xl">Entrar al panel</h1>
        <p className="mt-1 text-sm text-gris">Solo para el equipo de Distribuidora Maqserpan.</p>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
