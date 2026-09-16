"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import type { Category } from "@/types/category";
import { adminFetch } from "@/lib/services/admin-client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState<string | null>(null);

  const load = () => {
    adminFetch<Category[]>("/api/categories")
      .then(setCategories)
      .catch((err) => setListError(err instanceof Error ? err.message : "Failed to load categories."));
  };

  useEffect(load, []);

  const categoryName = (id: string | null) => categories?.find((c) => c.id === id)?.name ?? "—";

  const filtered = (categories ?? []).filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories ? `${categories.length} total` : "Loading..."}</p>
        </div>
        <Link href="/admin/categories/new" className={buttonVariants({ variant: "primary" })}>
          <Plus className="size-4.5" />
          Add Category
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search categories..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {listError && (
        <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {listError}
        </p>
      )}

      {categories && filtered.length === 0 ? (
        <EmptyState icon={Search} title="No categories found" description="Try a different search, or add a new category." />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Parent</th>
                <th className="px-5 py-3 font-semibold">Products</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-surface-alt/50">
                  <td className="px-5 py-3.5 font-medium text-foreground">{category.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{categoryName(category.parentId)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{category.productCount}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={category.isActive ? "success" : "neutral"}>{category.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        aria-label={`Edit ${category.name}`}
                        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-alt hover:text-foreground"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <ConfirmDeleteButton
                        itemLabel={category.name}
                        onConfirm={async () => {
                          await adminFetch(`/api/categories/${category.id}`, { method: "DELETE" });
                          load();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
