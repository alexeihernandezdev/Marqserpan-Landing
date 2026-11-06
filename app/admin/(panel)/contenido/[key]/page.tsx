import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { Card, CardContent } from "@/components/shadcn/card";
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
      <PageHeader
        back={{ href: "/admin/contenido", label: "Volver a contenido" }}
        title={SECTION_LABELS[key]}
        description="Frases cortas y claras. Sin precios ni plazos fijos."
      />
      <Card>
        <CardContent>
        <SectionEditor
          sectionKey={key}
          fields={EDITOR_FIELDS[key]}
          initialData={data as Record<string, string | string[] | { title: string; body: string }[]>}
        />
        </CardContent>
      </Card>
    </div>
  );
}
