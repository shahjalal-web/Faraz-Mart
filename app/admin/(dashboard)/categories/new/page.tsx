"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { adminFetch } from "@/lib/services/admin-client";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  const [topLevelCategories, setTopLevelCategories] = useState<Category[]>([]);

  useEffect(() => {
    adminFetch<Category[]>("/api/categories")
      .then((all) => setTopLevelCategories(all.filter((c) => c.parentId === null)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Add Category</h1>
      <CategoryForm mode="create" topLevelCategories={topLevelCategories} />
    </div>
  );
}
