"use server";

import { revalidatePath, updateTag } from "next/cache";
import { saveBusinessSettingsRecord } from "@/lib/dal/content";
import { verifySession } from "@/lib/dal/session";
import type { ActionState } from "@/lib/forms/action-state";
import { issuesByPath } from "@/lib/forms/issues";
import { TAGS } from "@/lib/tags";
import { businessSettingsSchema, SOCIAL_NETWORKS } from "@/lib/validation/business";

const lines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export async function saveBusinessSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await verifySession();
  const raw = {
    whatsapp: String(formData.get("whatsapp") ?? "").replace(/[\s\-()]/g, ""),
    email: String(formData.get("email") ?? "").trim(),
    address: String(formData.get("address") ?? ""),
    businessHours: String(formData.get("businessHours") ?? ""),
    socialLinks: SOCIAL_NETWORKS.map((network) => ({
      network,
      url: String(formData.get(`social_${network}`) ?? "").trim(),
      isTest: formData.get(`social_${network}_test`) === "on",
    })),
    paymentMethods: lines(formData.get("paymentMethods")),
    shippingCoverage: lines(formData.get("shippingCoverage")),
    deliveryTerms: lines(formData.get("deliveryTerms")),
    legalName: String(formData.get("legalName") ?? ""),
    rif: String(formData.get("rif") ?? ""),
  };

  const parsed = businessSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: issuesByPath(parsed.error) };
  }

  await saveBusinessSettingsRecord(parsed.data);
  updateTag(TAGS.settings);
  revalidatePath("/admin/negocio");
  return { status: "success", message: "Datos guardados. Ya se ven en la landing." };
}
