import type { Metadata } from "next";
import { getProductsList } from "@/lib/services/product-service";
import { getTopLevelCategories } from "@/lib/services/category-service";
import { parseProductSearchParams, type RawSearchParams } from "@/lib/product-query";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse every product on Faraz Mart — electronics, fashion, home, beauty and more.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { queryParams, currentParams } = parseProductSearchParams(resolvedSearchParams);

  const [result, categories] = await Promise.all([
    getProductsList(queryParams),
    getTopLevelCategories(),
  ]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Shop" }]} />
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">All Products</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Explore our full catalog across every category.
        </p>
      </div>

      <ProductListing
        result={result}
        categories={categories}
        basePath="/shop"
        currentParams={currentParams}
        sort={queryParams.sort}
      />
    </Container>
  );
}
