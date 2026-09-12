import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product-service";
import { getCategoryById } from "@/lib/services/category-service";
import { getProductReviews } from "@/lib/services/review-service";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductScrollRow } from "@/components/product/product-scroll-row";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [category, subcategory, relatedProducts, reviews] = await Promise.all([
    getCategoryById(product.categoryId),
    product.subcategoryId ? getCategoryById(product.subcategoryId) : Promise.resolve(null),
    getRelatedProducts(product, 8),
    getProductReviews(product.id),
  ]);

  const breadcrumbItems = [
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    ...(subcategory ? [{ label: subcategory.name, href: `/category/${subcategory.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <Container className="flex flex-col gap-10 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          seed={product.thumbnail}
          categoryId={product.subcategoryId ?? product.categoryId}
          frameCount={product.images.length}
          productName={product.name}
        />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="border-t border-border pt-8">
        <ProductTabs product={product} />
      </div>

      <div className="border-t border-border pt-8">
        <ProductReviews productId={product.id} productName={product.name} initialReviews={reviews} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-8">
          <SectionHeading title="You Might Also Like" description="More from the same category." className="pb-6" />
          <ProductScrollRow products={relatedProducts} />
        </div>
      )}
    </Container>
  );
}
