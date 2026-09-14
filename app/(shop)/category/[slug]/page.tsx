import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById, getCategoryBySlug, getSubcategories } from "@/lib/services/category-service";
import { getProductsList } from "@/lib/services/product-service";
import { parseProductSearchParams, type RawSearchParams } from "@/lib/product-query";
import { iconForCategory } from "@/lib/visual";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MediaTile } from "@/components/ui/media-tile";
import { ProductListing } from "@/components/product/product-listing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category || !category.isActive) notFound();

  const [subcategories, parentCategory, resolvedSearchParams] = await Promise.all([
    getSubcategories(category.id),
    category.parentId ? getCategoryById(category.parentId) : Promise.resolve(null),
    searchParams,
  ]);

  const { queryParams, currentParams } = parseProductSearchParams(resolvedSearchParams, {
    categoryId: resolvedSearchParams.category ? undefined : category.id,
  });
  // The base category always constrains results; a subcategory link is a plain nav, not a filter.
  if (!queryParams.categoryId) queryParams.categoryId = category.id;

  const result = await getProductsList(queryParams);
  const Icon = iconForCategory(category.slug);

  const breadcrumbItems = parentCategory
    ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }, { label: category.name }]
    : [{ label: category.name }];

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col gap-5 overflow-hidden rounded-card border border-border bg-surface sm:flex-row sm:items-center">
        <MediaTile seed={category.id} icon={Icon} className="h-40 w-full sm:h-auto sm:w-56" iconClassName="size-16" />
        <div className="flex flex-col gap-2 p-6">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{category.name}</h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{category.description}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {category.productCount} products
          </p>
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="rounded-pill border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <ProductListing
        result={result}
        basePath={`/category/${category.slug}`}
        currentParams={currentParams}
        sort={queryParams.sort}
      />
    </Container>
  );
}
