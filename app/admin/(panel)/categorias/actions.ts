"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { deleteCategoryRecord, reorderCategoryRecords, saveCategoryRecord } from "@/lib/dal/products";
import { verifySession } from "@/lib/dal/session";
import type { ActionState } from "@/lib/forms/action-state";
import { TAGS } from "@/lib/tags";
import { categorySchema } from "@/lib/validation/product";

const idSchema = z.uuid();

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await verifySession();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa el nombre de la categoría.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  try {
    await saveCategoryRecord(parsed.data);
  } catch {
    return { status: "error", message: "Ya existe una categoría con ese nombre." };
  }
  updateTag(TAGS.products);
  revalidatePath("/admin/categorias");
  return { status: "success", message: "Categoría guardada." };
}

export async function deleteCategory(id: string): Promise<ActionState> {
  await verifySession();
  const deleted = await deleteCategoryRecord(idSchema.parse(id));
  if (!deleted) {
    return {
      status: "error",
      message: "No se puede borrar: la categoría tiene productos. Muévelos a otra categoría primero.",
    };
  }
  updateTag(TAGS.products);
  revalidatePath("/admin/categorias");
  return { status: "success", message: "Categoría borrada." };
}

export async function reorderCategories(ids: string[]) {
  await verifySession();
  await reorderCategoryRecords(z.array(idSchema).max(100).parse(ids));
  updateTag(TAGS.products);
}
