import { categories, topLevelCategories } from "@/data/categories";
import type { Category } from "@/types/category";

/**
 * Service layer — the only place UI code should reach for category data.
 * Every function returns a Promise so the underlying data source can move
 * from this static mock array to a real API/database call later without
 * touching a single component.
 */
export async function getCategories(): Promise<Category[]> {
  return categories.filter((category) => category.isActive);
}

export async function getTopLevelCategories(): Promise<Category[]> {
  return topLevelCategories.filter((category) => category.isActive);
}

export async function getFeaturedCategories(limit = 8): Promise<Category[]> {
  const list = await getTopLevelCategories();
  return list.slice(0, limit);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return categories.find((category) => category.id === id) ?? null;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return categories.filter((category) => category.parentId === parentId && category.isActive);
}
