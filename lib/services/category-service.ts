import type { Category } from "@/types/category";
import { fetchJson } from "@/lib/services/backend-client";

/**
 * Service layer — the only place UI code should reach for category data.
 * Data now comes from the backend (MongoDB) instead of a static mock array,
 * but every function keeps its original signature so no component changed.
 */
async function getAllCategories(): Promise<Category[]> {
  return fetchJson<Category[]>("/api/categories");
}

export async function getCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter((category) => category.isActive);
}

export async function getTopLevelCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter((category) => category.parentId === null && category.isActive);
}

export async function getFeaturedCategories(limit = 8): Promise<Category[]> {
  const list = await getTopLevelCategories();
  return list.slice(0, limit);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find((category) => category.id === id) ?? null;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter((category) => category.parentId === parentId && category.isActive);
}
