import { sql } from "drizzle-orm";
import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_SECTIONS,
} from "../../lib/content/defaults";
import { businessSettings, categories, contentSections } from "../../lib/db/schema";
import { SECTION_ORDER } from "../../lib/validation/content";
import type { ScriptDb } from "./db";

/**
 * Carga el contenido inicial. Por defecto no pisa lo que el negocio ya editó en el admin;
 * con overwrite = true restablece secciones y datos del negocio a los valores iniciales.
 */
export async function seedDatabase(db: ScriptDb, { overwrite = false } = {}) {
  for (const key of SECTION_ORDER) {
    const insert = db.insert(contentSections).values({ key, data: DEFAULT_SECTIONS[key] });
    await (overwrite
      ? insert.onConflictDoUpdate({ target: contentSections.key, set: { data: DEFAULT_SECTIONS[key] } })
      : insert.onConflictDoNothing());
  }

  const settings = { id: 1, ...DEFAULT_BUSINESS_SETTINGS };
  const insertSettings = db.insert(businessSettings).values(settings);
  await (overwrite
    ? insertSettings.onConflictDoUpdate({ target: businessSettings.id, set: settings })
    : insertSettings.onConflictDoNothing());

  for (const [index, category] of DEFAULT_CATEGORIES.entries()) {
    await db
      .insert(categories)
      .values({ ...category, sortOrder: index })
      .onConflictDoNothing();
  }

  const [{ count }] = await db.execute<{ count: number }>(
    sql`select count(*)::int as count from content_sections`,
  ).then((r) => r.rows);
  return { sections: count };
}
