"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { adminFetch } from "@/lib/services/admin-client";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    adminFetch<Category[]>("/api/categories").then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Add Product</h1>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
