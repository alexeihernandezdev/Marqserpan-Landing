import { BusinessSettingsForm } from "@/components/admin/BusinessSettingsForm";
import { getBusinessSettingsForAdmin } from "@/lib/dal/content";

export const metadata = { title: "Datos del negocio" };

export default async function BusinessPage() {
  const settings = await getBusinessSettingsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl">Datos del negocio</h1>
        <p className="mt-1 text-gris">Contacto, redes, pagos y envíos que se muestran en la landing.</p>
      </header>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <BusinessSettingsForm settings={settings} />
      </section>
    </div>
  );
}
