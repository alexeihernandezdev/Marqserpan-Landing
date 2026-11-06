import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { LogOut } from "lucide-react";
import { AdminNav, AdminNavLinks } from "@/components/admin/AdminNav";
import { Button } from "@/components/shadcn/button";
import { verifySession } from "@/lib/dal/session";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Maqserpan" },
  robots: { index: false, follow: false },
};

async function UserBox() {
  const user = await verifySession();
  return (
    <div className="flex items-center justify-between gap-3 border-white/10 lg:mt-auto lg:flex-col lg:items-stretch lg:border-t lg:pt-4">
      <div className="flex min-w-0 items-center gap-2.5 lg:px-1">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold uppercase"
        >
          {user.name.slice(0, 1)}
        </span>
        <p className="truncate text-sm text-neutral-300">{user.name}</p>
      </div>
      <form action={logout}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-neutral-300 hover:bg-white/10 hover:text-white"
        >
          <LogOut /> Cerrar sesión
        </Button>
      </form>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-ui flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex flex-col gap-4 bg-carbon p-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:gap-6">
        <Link href="/admin" className="flex items-center gap-2.5 lg:px-1">
          <Image src="/brand/engranajes.webp" alt="" width={32} height={32} className="size-8" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg">Panel</span>
            <span className="text-xs text-neutral-400">Maqserpan</span>
          </span>
        </Link>
        <Suspense fallback={<AdminNavLinks pathname={null} />}>
          <AdminNav />
        </Suspense>
        <Suspense fallback={null}>
          <UserBox />
        </Suspense>
      </aside>
      <main className="flex-1 bg-hueso p-4 sm:p-8">
        {/* Cada página valida la sesión en el DAL, dentro de su loading.tsx: esperarla aquí
            bloquearía la navegación entre páginas del panel (Instant Navigation). */}
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
