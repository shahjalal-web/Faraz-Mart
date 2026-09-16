"use client";

import { use, useEffect, useState } from "react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { adminFetch } from "@/lib/services/admin-client";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([adminFetch<Product>(`/api/products/${id}`), adminFetch<Category[]>("/api/categories")])
      .then(([fetchedProduct, fetchedCategories]) => {
        setProduct(fetchedProduct);
        setCategories(fetchedCategories);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load product."));
  }, [id]);

  if (error) {
    return (
      <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
        {error}
      </p>
    );
  }

  if (!product) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Edit Product</h1>
      <ProductForm mode="edit" initial={product} productId={id} categories={categories} />
    </div>
  );
}
