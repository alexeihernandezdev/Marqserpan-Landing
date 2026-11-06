"use client";

import {
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Tags,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: Inbox },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageSquareQuote },
  { href: "/admin/negocio", label: "Negocio", icon: Building2 },
  { href: "/admin/cuenta", label: "Cuenta", icon: UserRound },
];

export function AdminNav() {
  return <AdminNavLinks pathname={usePathname()} />;
}

/** Sin hooks: sirve también de fallback de <Suspense> durante el prerender. */
export function AdminNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Panel" className="-mx-1 overflow-x-auto px-1 lg:mx-0 lg:px-0">
      <ul className="flex gap-1 whitespace-nowrap lg:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname
            ? href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)
            : false;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-amarillo text-carbon shadow-sm"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
