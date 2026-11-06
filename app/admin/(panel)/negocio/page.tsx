import { PageHeader } from "@/components/admin/PageHeader";
import { BusinessSettingsForm } from "@/components/admin/BusinessSettingsForm";
import { getBusinessSettingsForAdmin } from "@/lib/dal/content";

export const metadata = { title: "Datos del negocio" };

export default async function BusinessPage() {
  const settings = await getBusinessSettingsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Datos del negocio" description="Contacto, redes, pagos y envíos que se muestran en la landing." />
      <BusinessSettingsForm settings={settings} />
    </div>
  );
}
