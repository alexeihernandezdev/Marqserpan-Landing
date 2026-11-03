import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { EDITOR_FIELDS } from "@/lib/content/editor-fields";
import { getSectionForAdmin } from "@/lib/dal/content";
import { isSectionKey, SECTION_LABELS } from "@/lib/validation/content";

export const metadata = { title: "Editar sección" };

export default async function EditSectionPage({ params }: PageProps<"/admin/contenido/[key]">) {
  const { key } = await params;
  if (!isSectionKey(key)) notFound();
  const data = await getSectionForAdmin(key);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/contenido" className="text-sm font-bold underline">
        ← Volver a contenido
      </Link>
      <header>
        <h1 className="text-3xl">{SECTION_LABELS[key]}</h1>
        <p className="mt-1 text-gris">Frases cortas y claras. Sin precios ni plazos fijos.</p>
      </header>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <SectionEditor
          sectionKey={key}
          fields={EDITOR_FIELDS[key]}
          initialData={data as Record<string, string | string[] | { title: string; body: string }[]>}
        />
      </section>
    </div>
  );
}
