import type { Category } from "@/types/category";
import type { Product, ProductListResult, ProductQueryParams } from "@/types/product";
import { fetchJson } from "@/lib/services/backend-client";

const PRICE_RANGE_BOUNDS: Record<NonNullable<ProductQueryParams["priceRange"]>, [number, number]> = {
  "under-25": [0, 25],
  "25-50": [25, 50],
  "50-100": [50, 100],
  "100-250": [100, 250],
  "250-plus": [250, Infinity],
};

function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

/**
 * Service layer — the only place UI code should reach for product data.
 * Data now comes from the backend (MongoDB) instead of a static mock array,
 * but every function keeps its original signature so no component changed.
 */
export async function getProducts(): Promise<Product[]> {
  return fetchJson<Product[]>("/api/products");
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.isFeatured).slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products]
    .filter((product) => product.isBestSeller)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products]
    .filter((product) => product.isNewArrival)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getFlashSaleProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.isFlashSale && product.salePrice).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(
    (product) => product.categoryId === categoryId || product.subcategoryId === categoryId
  );
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, limit);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const idSet = new Set(ids);
  const products = await getProducts();
  return products.filter((product) => idSet.has(product.id));
}

/**
 * Single filter/sort/paginate entry point shared by /shop, /category/[slug],
 * /search, /deals and /new-arrivals.
 */
export async function getProductsList(params: ProductQueryParams = {}): Promise<ProductListResult> {
  const {
    categoryId,
    query,
    brands,
    priceRange,
    minRating,
    inStockOnly,
    onSaleOnly,
    sort = "relevance",
    page = 1,
    pageSize = 12,
  } = params;

  const [products, categories] = await Promise.all([getProducts(), fetchJson<Category[]>("/api/categories")]);

  let filtered = [...products];

  if (categoryId) {
    const matchingCategoryIds = new Set(
      categories.filter((c) => c.id === categoryId || c.parentId === categoryId).map((c) => c.id)
    );
    filtered = filtered.filter(
      (product) => matchingCategoryIds.has(product.categoryId) || (product.subcategoryId && matchingCategoryIds.has(product.subcategoryId))
    );
  }

  if (query) {
    const needle = query.trim().toLowerCase();
    if (needle) {
      const matchingCategoryNames = new Set(
        categories.filter((c) => c.name.toLowerCase().includes(needle)).map((c) => c.id)
      );
      filtered = filtered.filter((product) => {
        return (
          product.name.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.sku.toLowerCase().includes(needle) ||
          product.shortDescription.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle) ||
          product.tags.some((tag) => tag.toLowerCase().includes(needle)) ||
          matchingCategoryNames.has(product.categoryId) ||
          (product.subcategoryId ? matchingCategoryNames.has(product.subcategoryId) : false)
        );
      });
    }
  }

  if (brands && brands.length > 0) {
    const brandSet = new Set(brands);
    filtered = filtered.filter((product) => brandSet.has(product.brand));
  }

  if (priceRange) {
    const [min, max] = PRICE_RANGE_BOUNDS[priceRange];
    filtered = filtered.filter((product) => {
      const price = effectivePrice(product);
      return price >= min && price < max;
    });
  }

  if (minRating) {
    filtered = filtered.filter((product) => product.rating >= minRating);
  }

  if (inStockOnly) {
    filtered = filtered.filter((product) => product.stockStatus !== "out-of-stock");
  }

  if (onSaleOnly) {
    filtered = filtered.filter((product) => typeof product.salePrice === "number");
  }

  const availableBrands = Array.from(new Set(filtered.map((product) => product.brand))).sort();

  switch (sort) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "price-asc":
      filtered.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price-desc":
      filtered.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
      filtered.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case "discount":
      filtered.sort(
        (a, b) =>
          (b.salePrice ? b.price - b.salePrice : 0) - (a.salePrice ? a.price - a.salePrice : 0)
      );
      break;
    case "relevance":
    default:
      break;
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages, availableBrands };
}

/** Earliest active flash-sale deadline, used to drive the deals countdown. */
export async function getNextFlashSaleDeadline(): Promise<string | null> {
  const products = await getProducts();
  const active = await getFlashSaleProducts(products.length);
  if (active.length === 0) return null;

  return active.reduce<string | null>((earliest, product) => {
    if (!product.flashSaleEndsAt) return earliest;
    if (!earliest) return product.flashSaleEndsAt;
    return new Date(product.flashSaleEndsAt) < new Date(earliest) ? product.flashSaleEndsAt : earliest;
  }, null);
}
