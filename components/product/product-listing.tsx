import type { Category } from "@/types/category";
import type { ProductListResult, ProductSortOption } from "@/types/product";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { MobileFilterButton } from "@/components/product/filter-panel";
import { SortSelect } from "@/components/product/sort-select";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/ui/pagination";

/**
 * Shared filter + sort + grid + pagination layout used by /shop,
 * /category/[slug], /search, /deals and /new-arrivals so each page only
 * has to fetch the right data — the shell stays identical everywhere.
 */
export function ProductListing({
  result,
  categories,
  basePath,
  currentParams,
  sort = "relevance",
}: {
  result: ProductListResult;
  categories?: Category[];
  basePath: string;
  currentParams: Record<string, string | string[] | undefined>;
  sort?: ProductSortOption;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <FilterSidebar categories={categories} availableBrands={result.availableBrands} className="hidden lg:flex" />

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileFilterButton categories={categories} availableBrands={result.availableBrands} />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{result.total}</span> product
              {result.total === 1 ? "" : "s"} found
            </p>
          </div>
          <SortSelect value={sort} />
        </div>

        <ProductGrid products={result.items} className="sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" />

        <Pagination
          basePath={basePath}
          params={currentParams}
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      </div>
    </div>
  );
}
