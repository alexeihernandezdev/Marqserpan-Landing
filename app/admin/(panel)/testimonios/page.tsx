import { PageHeader } from "@/components/admin/PageHeader";
import { NewTestimonial, TestimonialManager } from "@/components/admin/TestimonialManager";
import { listTestimonialsForAdmin } from "@/lib/dal/content";

export const metadata = { title: "Testimonios" };

export default async function TestimonialsPage() {
  const items = await listTestimonialsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimonios"
        description="Pide a tus clientes: qué problema tenían, qué los frustraba, qué hicimos distinto y cómo están ahora."
      />
      {/* key: al crear un testimonio, la lista se vuelve a montar con el nuevo. */}
      <TestimonialManager
        key={items.map((t) => t.id).join("|")}
        initialItems={items.map(({ id, quote, authorName, businessName, city, isVisible }) => ({
          id,
          quote,
          authorName,
          businessName,
          city,
          isVisible,
        }))}
      />
      <NewTestimonial />
    </div>
  );
}
