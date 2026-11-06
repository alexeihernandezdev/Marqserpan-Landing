import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { getProductForAdmin, listBrandsForAdmin, listCategoriesForAdmin } from "@/lib/dal/products";
import { deleteProduct } from "../actions";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/productos/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!z.uuid().safeParse(id).success) notFound();
  const [product, categories, brands] = await Promise.all([
    getProductForAdmin(id),
    listCategoriesForAdmin(),
    listBrandsForAdmin(),
  ]);
  if (!product) notFound();

  const remove = deleteProduct.bind(null, product.id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        back={{ href: "/admin/productos", label: "Volver a productos" }}
        title={product.name}
        badge={
          product.isVisible ? (
            <Badge className="bg-green-50 text-verde-800 border-verde-700/30">Publicado</Badge>
          ) : (
            <Badge variant="secondary" className="border-border">Oculto</Badge>
          )
        }
        actions={
          product.isVisible && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/productos/${product.slug}`} target="_blank">
                Ver en la landing <ExternalLink />
              </Link>
            </Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Datos</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
        <ProductForm
          key={product.id}
          categories={categories}
          brands={brands}
          product={product}
          initialMessage={query.guardado === "1" ? "Producto guardado. Ahora agrega las fotos." : undefined}
        />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Fotos</h2>
          </CardTitle>
          <CardDescription>La primera foto es la portada del catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
        <ImageUploader
          productId={product.id}
          productName={product.name}
          initialImages={product.images.map((img) => ({
            id: img.id,
            publicId: img.cloudinaryPublicId,
            width: img.width,
            height: img.height,
            alt: img.alt,
          }))}
        />
        </CardContent>
      </Card>

      <div>
        <ConfirmButton
          label="Borrar producto"
          question="¿Borrar este producto y sus fotos? Las solicitudes conservan su nombre."
          onConfirm={remove}
        />
      </div>
    </div>
  );
}
