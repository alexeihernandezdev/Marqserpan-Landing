"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/contenido", label: "Contenido" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/negocio", label: "Negocio" },
  { href: "/admin/cuenta", label: "Cuenta" },
];

export function AdminNav() {
  return <AdminNavLinks pathname={usePathname()} />;
}

/** Sin hooks: sirve también de fallback de <Suspense> durante el prerender. */
export function AdminNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Panel" className="overflow-x-auto">
      <ul className="flex gap-1 whitespace-nowrap lg:flex-col">
        {LINKS.map((link) => {
          const active = pathname
            ? link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)
            : false;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-3 py-2 text-sm font-bold ${
                  active ? "bg-amarillo text-carbon" : "text-neutral-200 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
