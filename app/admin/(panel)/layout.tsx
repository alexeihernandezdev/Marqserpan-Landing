import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { AdminNav, AdminNavLinks } from "@/components/admin/AdminNav";
import { verifySession } from "@/lib/dal/session";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Maqserpan" },
  robots: { index: false, follow: false },
};

async function UserBox() {
  const user = await verifySession();
  return (
    <div className="flex items-center justify-between gap-3 border-white/10 lg:mt-auto lg:flex-col lg:items-stretch lg:border-t lg:pt-4">
      <p className="truncate text-sm text-neutral-300">{user.name}</p>
      <form action={logout}>
        <button type="submit" className="rounded-md px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

/** El contenido del panel lee la sesión: queda dentro de <Suspense> (Cache Components). */
async function Protected({ children }: { children: ReactNode }) {
  await verifySession();
  return <>{children}</>;
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex flex-col gap-4 bg-carbon p-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-60">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/brand/engranajes.webp" alt="" width={32} height={32} className="size-8" />
          <span className="font-display text-lg">Panel</span>
        </Link>
        <Suspense fallback={<AdminNavLinks pathname={null} />}>
          <AdminNav />
        </Suspense>
        <Suspense fallback={null}>
          <UserBox />
        </Suspense>
      </aside>
      <main className="flex-1 bg-hueso p-4 sm:p-8">
        <Suspense fallback={<p className="text-gris">Cargando…</p>}>
          <Protected>{children}</Protected>
        </Suspense>
      </main>
    </div>
  );
}
