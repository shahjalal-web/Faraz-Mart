"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import type { Product } from "@/types/product";
import { adminFetch } from "@/lib/services/admin-client";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

const STOCK_BADGE: Record<Product["stockStatus"], "success" | "warning" | "danger"> = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "danger",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState<string | null>(null);

  const load = () => {
    adminFetch<Product[]>("/api/products")
      .then(setProducts)
      .catch((err) => setListError(err instanceof Error ? err.message : "Failed to load products."));
  };

  useEffect(load, []);

  const needle = search.trim().toLowerCase();
  const filtered = (products ?? []).filter(
    (p) => p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{products ? `${products.length} total` : "Loading..."}</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ variant: "primary" })}>
          <Plus className="size-4.5" />
          Add Product
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name, SKU or brand..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {listError && (
        <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {listError}
        </p>
      )}

      {products && filtered.length === 0 ? (
        <EmptyState icon={Search} title="No products found" description="Try a different search, or add a new product." />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-surface-alt/50">
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.brand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{product.sku}</td>
                  <td className="px-5 py-3.5 text-foreground">
                    {product.salePrice ? (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{formatPrice(product.salePrice)}</span>
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                      </span>
                    ) : (
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STOCK_BADGE[product.stockStatus]}>{product.stock} · {product.stockStatus}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-alt hover:text-foreground"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <ConfirmDeleteButton
                        itemLabel={product.name}
                        onConfirm={async () => {
                          await adminFetch(`/api/products/${product.id}`, { method: "DELETE" });
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
