import type { Metadata } from "next";
import { getProductsList } from "@/lib/services/product-service";
import { getTopLevelCategories } from "@/lib/services/category-service";
import { parseProductSearchParams, type RawSearchParams } from "@/lib/product-query";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/components/product/product-listing";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search Fajar Mart for products, brands and categories.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { queryParams, currentParams } = parseProductSearchParams(resolvedSearchParams);
  const query = queryParams.query?.trim() ?? "";

  const [result, categories] = await Promise.all([
    query ? getProductsList(queryParams) : Promise.resolve(null),
    getTopLevelCategories(),
  ]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Search" }]} />

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {query ? (
            <>
              Search results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        {result && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {result.total} product{result.total === 1 ? "" : "s"} found
          </p>
        )}
      </div>

      {!query ? (
        <EmptyState
          icon={SearchX}
          title="Start typing to search"
          description="Use the search bar above to find products, brands and categories."
        />
      ) : result && result.total === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No results for "${query}"`}
          description="Try a different keyword, or check the spelling of a brand or product name."
        />
      ) : (
        result && (
          <ProductListing
            result={result}
            categories={categories}
            basePath="/search"
            currentParams={currentParams}
            sort={queryParams.sort}
          />
        )
      )}
    </Container>
  );
}
