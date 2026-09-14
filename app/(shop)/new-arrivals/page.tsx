import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getProductsList } from "@/lib/services/product-service";
import { getTopLevelCategories } from "@/lib/services/category-service";
import { parseProductSearchParams, type RawSearchParams } from "@/lib/product-query";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Discover the newest products added to Faraz Mart.",
};

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { queryParams, currentParams } = parseProductSearchParams(resolvedSearchParams, {
    ...(resolvedSearchParams.sort ? {} : { sort: "newest" as const }),
  });

  const [result, categories] = await Promise.all([
    getProductsList(queryParams),
    getTopLevelCategories(),
  ]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "New Arrivals" }]} />
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-[#6D5DF6] to-[#FF3D77] text-white shadow-glow-primary">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">New Arrivals</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Fresh drops across every category.</p>
        </div>
      </div>

      <ProductListing
        result={result}
        categories={categories}
        basePath="/new-arrivals"
        currentParams={currentParams}
        sort={queryParams.sort}
      />
    </Container>
  );
}
