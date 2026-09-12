import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { getProductsList } from "@/lib/services/product-service";
import { getTopLevelCategories } from "@/lib/services/category-service";
import { parseProductSearchParams, type RawSearchParams } from "@/lib/product-query";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = {
  title: "Deals & Discounts",
  description: "Shop every discounted product on Fajar Mart in one place.",
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { queryParams, currentParams } = parseProductSearchParams(resolvedSearchParams, {
    onSaleOnly: true,
    ...(resolvedSearchParams.sort ? {} : { sort: "discount" as const }),
  });

  const [result, categories] = await Promise.all([
    getProductsList(queryParams),
    getTopLevelCategories(),
  ]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Deals" }]} />
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow-primary">
          <Flame className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Deals & Discounts</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Every discounted product on Fajar Mart, all in one place.
          </p>
        </div>
      </div>

      <ProductListing
        result={result}
        categories={categories}
        basePath="/deals"
        currentParams={currentParams}
        sort={queryParams.sort}
      />
    </Container>
  );
}
