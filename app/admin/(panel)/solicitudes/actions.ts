"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { removeLead, updateLeadStatus } from "@/lib/dal/leads";
import { verifySession } from "@/lib/dal/session";
import { LEAD_STATUSES } from "@/lib/validation/lead-constants";

const idSchema = z.uuid();

export async function setLeadStatus(id: string, status: (typeof LEAD_STATUSES)[number]) {
  await verifySession();
  const parsedId = idSchema.parse(id);
  const parsedStatus = z.enum(LEAD_STATUSES).parse(status);
  await updateLeadStatus(parsedId, parsedStatus);
  revalidatePath("/admin", "layout");
}

export async function deleteLead(id: string) {
  await verifySession();
  await removeLead(idSchema.parse(id));
  revalidatePath("/admin", "layout");
  redirect("/admin/solicitudes");
}
