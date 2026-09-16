"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/category";
import { slugify } from "@/lib/utils";
import { adminFetch } from "@/lib/services/admin-client";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function CategoryForm({
  mode,
  initial,
  categoryId,
  topLevelCategories,
}: {
  mode: "create" | "edit";
  initial?: Category;
  categoryId?: string;
  /** Only top-level categories can be a parent, so subcategories stay one level deep. */
  topLevelCategories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [parentId, setParentId] = useState(initial?.parentId ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      image,
      parentId: parentId || null,
      isActive,
      seoTitle,
      seoDescription,
    };

    try {
      if (mode === "create") {
        await adminFetch("/api/categories", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/categories/${categoryId}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      {error && (
        <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <FormField label="Name" htmlFor="cat-name" required>
        <Input
          id="cat-name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </FormField>

      <FormField label="Slug" htmlFor="cat-slug" required>
        <Input
          id="cat-slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
        />
      </FormField>

      <FormField label="Description" htmlFor="cat-description">
        <Textarea id="cat-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormField>

      <FormField label="Image key" htmlFor="cat-image">
        <Input
          id="cat-image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="e.g. electronics"
        />
      </FormField>

      <FormField label="Parent category" htmlFor="cat-parent">
        <Select id="cat-parent" value={parentId ?? ""} onChange={(e) => setParentId(e.target.value)}>
          <option value="">None (top-level category)</option>
          {topLevelCategories
            .filter((c) => c.id !== categoryId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </Select>
      </FormField>

      <Checkbox id="cat-active" label="Active (visible on the storefront)" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="SEO title" htmlFor="cat-seo-title">
          <Input id="cat-seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </FormField>
        <FormField label="SEO description" htmlFor="cat-seo-description">
          <Input id="cat-seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Category" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
