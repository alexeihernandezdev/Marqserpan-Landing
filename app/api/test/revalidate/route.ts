import { revalidateTag } from "next/cache";
import { isProduction } from "@/lib/env";
import { TAGS } from "@/lib/tags";

// Solo para pruebas e2e: invalida la caché pública tras cambiar datos directo en la BD.
// No existe (404) salvo con E2E_TESTING=true fuera de producción y el secreto correcto.
export async function POST(request: Request) {
  const secret = process.env.E2E_TESTING_SECRET;
  if (process.env.E2E_TESTING !== "true" || isProduction() || !secret) {
    return new Response(null, { status: 404 });
  }
  if (request.headers.get("x-e2e-secret") !== secret) {
    return new Response(null, { status: 404 });
  }
  for (const tag of Object.values(TAGS)) {
    revalidateTag(tag, { expire: 0 });
  }
  return Response.json({ ok: true });
}
