"use server";

import { revalidatePath, updateTag } from "next/cache";
import { saveSectionRecord } from "@/lib/dal/content";
import { verifySession } from "@/lib/dal/session";
import type { ActionState } from "@/lib/forms/action-state";
import { issuesByPath } from "@/lib/forms/issues";
import { TAGS } from "@/lib/tags";
import { isSectionKey, sectionSchemas } from "@/lib/validation/content";

/** Guarda una sección de la historia. El editor envía su contenido como JSON en "data". */
export async function saveSection(key: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await verifySession();
  if (!isSectionKey(key)) return { status: "error", message: "Sección desconocida." };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("data") ?? ""));
  } catch {
    return { status: "error", message: "No se pudo leer el contenido. Recarga la página." };
  }

  const parsed = sectionSchemas[key].safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: issuesByPath(parsed.error) };
  }

  await saveSectionRecord(key, parsed.data);
  updateTag(TAGS.content);
  revalidatePath("/admin/contenido");
  return { status: "success", message: "Sección guardada. Ya se ve en la landing." };
}
