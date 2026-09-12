import type { PriceRangeValue, ProductQueryParams, ProductSortOption } from "@/types/product";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const VALID_SORTS: ProductSortOption[] = [
  "relevance",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
  "popularity",
  "discount",
];

const VALID_PRICE_RANGES: PriceRangeValue[] = ["under-25", "25-50", "50-100", "100-250", "250-plus"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Turns the raw Next.js `searchParams` object into typed filter params for
 * `getProductsList`, plus a flat string record used to rebuild pagination
 * links without dropping whatever filters are currently active.
 */
export function parseProductSearchParams(
  searchParams: RawSearchParams,
  extra: Partial<ProductQueryParams> = {}
): { queryParams: ProductQueryParams; currentParams: Record<string, string | string[] | undefined> } {
  const sortRaw = first(searchParams.sort);
  const sort = VALID_SORTS.includes(sortRaw as ProductSortOption) ? (sortRaw as ProductSortOption) : "relevance";

  const priceRaw = first(searchParams.price);
  const priceRange = VALID_PRICE_RANGES.includes(priceRaw as PriceRangeValue) ? (priceRaw as PriceRangeValue) : undefined;

  const ratingRaw = first(searchParams.rating);
  const minRating = ratingRaw ? Number(ratingRaw) : undefined;

  const pageRaw = first(searchParams.page);
  const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : 1;

  const brands = all(searchParams.brand);
  const category = first(searchParams.category);
  const query = first(searchParams.q);

  const queryParams: ProductQueryParams = {
    categoryId: category,
    query,
    brands: brands.length > 0 ? brands : undefined,
    priceRange,
    minRating,
    inStockOnly: first(searchParams.inStock) === "1",
    onSaleOnly: first(searchParams.onSale) === "1",
    sort,
    page,
    ...extra,
  };

  const currentParams: Record<string, string | string[] | undefined> = {
    category,
    price: priceRange,
    rating: ratingRaw,
    brand: brands.length > 0 ? brands : undefined,
    inStock: first(searchParams.inStock),
    onSale: first(searchParams.onSale),
    sort: sort !== "relevance" ? sort : undefined,
    q: query,
  };

  return { queryParams, currentParams };
}
