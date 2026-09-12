import {
  Armchair,
  Baby,
  Blocks,
  BookOpen,
  Footprints,
  Gem,
  Headphones,
  Laptop,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Watch,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

/**
 * Fajar Mart has no product photography yet, so category/product art is generated
 * from a deterministic "dawn gradient" palette instead of external image URLs.
 * Swapping in real photos later only means changing the `image`/`thumbnail` fields.
 */
export const GRADIENTS = [
  "from-[#FF7A45] to-[#FF4D8D]", // Sunrise
  "from-[#6D5DF6] to-[#FF4D8D]", // Dusk Violet
  "from-[#FFB020] to-[#FF7A45]", // Golden Hour
  "from-[#14B8A6] to-[#4F46E5]", // Ocean Teal
  "from-[#D946EF] to-[#4F46E5]", // Berry
  "from-[#84CC16] to-[#FFB020]", // Citrus
  "from-[#38BDF8] to-[#4F46E5]", // Sky
  "from-[#FB7185] to-[#FF7A45]", // Coral Rose
] as const;

export function gradientForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

/**
 * Keyed by both category `slug` (used for nav/category pages) and category
 * `id` (used by products via `categoryId`/`subcategoryId`) so either can be
 * passed straight in without a data lookup.
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  electronics: Smartphone,
  "cat-electronics": Smartphone,
  "mobile-phones": Smartphone,
  "cat-mobile-phones": Smartphone,
  laptops: Laptop,
  "cat-laptops": Laptop,
  audio: Headphones,
  "cat-audio": Headphones,
  fashion: Shirt,
  "cat-fashion": Shirt,
  mens: Shirt,
  "cat-mens": Shirt,
  womens: Shirt,
  "cat-womens": Shirt,
  "kids-fashion": Baby,
  "cat-kids-fashion": Baby,
  "home-living": Armchair,
  "cat-home-living": Armchair,
  "beauty-personal-care": Sparkles,
  "cat-beauty": Sparkles,
  "sports-outdoors": Dumbbell,
  "cat-sports": Dumbbell,
  footwear: Footprints,
  "cat-footwear": Footprints,
  "bags-accessories": ShoppingBag,
  "cat-bags": ShoppingBag,
  "watches-jewelry": Watch,
  "cat-watches": Watch,
  "groceries-gourmet": ShoppingBasket,
  "cat-groceries": ShoppingBasket,
  "books-stationery": BookOpen,
  "cat-books": BookOpen,
  "toys-kids": Blocks,
  "cat-toys": Blocks,
};

export function iconForCategory(slugOrId: string): LucideIcon {
  return CATEGORY_ICON_MAP[slugOrId] ?? Gem;
}
