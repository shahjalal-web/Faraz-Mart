"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/category";
import type { Product, StockStatus } from "@/types/product";
import { slugify } from "@/lib/utils";
import { adminFetch } from "@/lib/services/admin-client";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const STOCK_STATUSES: StockStatus[] = ["in-stock", "low-stock", "out-of-stock"];

function toDateTimeLocal(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export function ProductForm({
  mode,
  initial,
  productId,
  categories,
}: {
  mode: "create" | "edit";
  initial?: Product;
  productId?: string;
  categories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategoryId ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [images, setImages] = useState((initial?.images ?? []).join(", "));
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initial?.salePrice?.toString() ?? "");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "0");
  const [stockStatus, setStockStatus] = useState<StockStatus>(initial?.stockStatus ?? "in-stock");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initial?.isBestSeller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initial?.isNewArrival ?? false);
  const [isFlashSale, setIsFlashSale] = useState(initial?.isFlashSale ?? false);
  const [flashSaleEndsAt, setFlashSaleEndsAt] = useState(toDateTimeLocal(initial?.flashSaleEndsAt));
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topLevelCategories = useMemo(() => categories.filter((c) => c.parentId === null), [categories]);
  const subcategoryOptions = useMemo(
    () => categories.filter((c) => c.parentId === categoryId),
    [categories, categoryId]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      sku,
      brand,
      categoryId,
      subcategoryId: subcategoryId || null,
      shortDescription,
      description,
      thumbnail,
      images: images.split(",").map((v) => v.trim()).filter(Boolean),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock),
      stockStatus,
      tags: tags.split(",").map((v) => v.trim()).filter(Boolean),
      isFeatured,
      isBestSeller,
      isNewArrival,
      isFlashSale,
      flashSaleEndsAt: isFlashSale && flashSaleEndsAt ? new Date(flashSaleEndsAt).toISOString() : null,
      seoTitle,
      seoDescription,
    };

    try {
      if (mode === "create") {
        await adminFetch("/api/products", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/products/${productId}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-5">
      {error && (
        <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" htmlFor="p-name" required>
          <Input
            id="p-name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </FormField>
        <FormField label="Slug" htmlFor="p-slug" required>
          <Input
            id="p-slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </FormField>
        <FormField label="SKU" htmlFor="p-sku" required>
          <Input id="p-sku" required value={sku} onChange={(e) => setSku(e.target.value)} />
        </FormField>
        <FormField label="Brand" htmlFor="p-brand" required>
          <Input id="p-brand" required value={brand} onChange={(e) => setBrand(e.target.value)} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" htmlFor="p-category" required>
          <Select
            id="p-category"
            required
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {topLevelCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Subcategory" htmlFor="p-subcategory">
          <Select id="p-subcategory" value={subcategoryId ?? ""} onChange={(e) => setSubcategoryId(e.target.value)} disabled={subcategoryOptions.length === 0}>
            <option value="">None</option>
            {subcategoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Short description" htmlFor="p-short-desc" required>
        <Input id="p-short-desc" required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      </FormField>
      <FormField label="Description" htmlFor="p-desc" required>
        <Textarea id="p-desc" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Thumbnail key" htmlFor="p-thumbnail" required>
          <Input id="p-thumbnail" required value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="e.g. nimbus-x12-1" />
        </FormField>
        <FormField label="Image keys (comma-separated)" htmlFor="p-images">
          <Input id="p-images" value={images} onChange={(e) => setImages(e.target.value)} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <FormField label="Price" htmlFor="p-price" required>
          <Input id="p-price" type="number" min="0" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormField>
        <FormField label="Sale price" htmlFor="p-sale-price">
          <Input id="p-sale-price" type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </FormField>
        <FormField label="Stock" htmlFor="p-stock" required>
          <Input id="p-stock" type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)} />
        </FormField>
        <FormField label="Stock status" htmlFor="p-stock-status">
          <Select id="p-stock-status" value={stockStatus} onChange={(e) => setStockStatus(e.target.value as StockStatus)}>
            {STOCK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Tags (comma-separated)" htmlFor="p-tags">
        <Input id="p-tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </FormField>

      <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-card border border-border bg-surface-alt/40 p-4">
        <Checkbox id="p-featured" label="Featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        <Checkbox id="p-bestseller" label="Best Seller" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
        <Checkbox id="p-new" label="New Arrival" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
        <Checkbox id="p-flash" label="Flash Sale" checked={isFlashSale} onChange={(e) => setIsFlashSale(e.target.checked)} />
      </div>

      {isFlashSale && (
        <FormField label="Flash sale ends at" htmlFor="p-flash-ends">
          <Input id="p-flash-ends" type="datetime-local" value={flashSaleEndsAt} onChange={(e) => setFlashSaleEndsAt(e.target.value)} />
        </FormField>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="SEO title" htmlFor="p-seo-title">
          <Input id="p-seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </FormField>
        <FormField label="SEO description" htmlFor="p-seo-description">
          <Input id="p-seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
