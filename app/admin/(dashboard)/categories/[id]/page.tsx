"use client";

import { use, useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { adminFetch } from "@/lib/services/admin-client";
import { CategoryForm } from "@/components/admin/category-form";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [topLevelCategories, setTopLevelCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Category[]>("/api/categories")
      .then((all) => {
        setTopLevelCategories(all.filter((c) => c.parentId === null));
        setCategory(all.find((c) => c.id === id) ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load category."));
  }, [id]);

  if (error) {
    return (
      <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
        {error}
      </p>
    );
  }

  if (!category) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Edit Category</h1>
      <CategoryForm mode="edit" initial={category} categoryId={id} topLevelCategories={topLevelCategories} />
    </div>
  );
}
