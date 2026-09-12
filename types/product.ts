export interface ProductVariantOption {
  id: string;
  name: string;
  value: string;
  hex?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  image?: string;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  subcategoryId?: string;
  brand: string;
  shortDescription: string;
  description: string;
  images: string[];
  thumbnail: string;
  price: number;
  salePrice?: number;
  stock: number;
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  soldCount: number;
  tags: string[];
  colors?: ProductVariantOption[];
  sizes?: ProductVariantOption[];
  variants?: ProductVariant[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFlashSale: boolean;
  flashSaleEndsAt?: string;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type ProductSortOption =
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popularity"
  | "discount";

export type PriceRangeValue = "under-25" | "25-50" | "50-100" | "100-250" | "250-plus";

export interface ProductQueryParams {
  categoryId?: string;
  query?: string;
  brands?: string[];
  priceRange?: PriceRangeValue;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: ProductSortOption;
  page?: number;
  pageSize?: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  availableBrands: string[];
}
