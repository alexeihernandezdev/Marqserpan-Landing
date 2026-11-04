import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// Páginas del admin que se abren sin sesión.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/recuperar", "/admin/restablecer"];

// Comprobación optimista: sin cookie de sesión, al login. No consulta la BD; la verificación
// real la hace verifySession() en cada página y acción del admin.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
