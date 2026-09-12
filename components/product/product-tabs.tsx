"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const TABS = ["Description", "Specifications", "Shipping & Returns"] as const;
type Tab = (typeof TABS)[number];

function Specifications({ product }: { product: Product }) {
  const rows: [string, string][] = [
    ["Brand", product.brand],
    ["SKU", product.sku],
    ["Stock Status", product.stockStatus.replace("-", " ")],
  ];
  if (product.colors?.length) rows.push(["Available Colors", product.colors.map((c) => c.value).join(", ")]);
  if (product.sizes?.length) rows.push(["Available Sizes", product.sizes.map((s) => s.value).join(", ")]);
  rows.push(["Tags", product.tags.join(", ")]);

  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-border/70 py-2 text-sm sm:justify-start">
          <dt className="font-semibold capitalize text-foreground">{label}</dt>
          <dd className="text-right capitalize text-muted-foreground sm:text-left">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<Tab>("Description");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 overflow-x-auto border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative whitespace-nowrap pb-3 text-sm font-semibold transition-colors",
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "Description" && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90 sm:text-base">
            {product.description}
          </p>
        )}
        {activeTab === "Specifications" && <Specifications product={product} />}
        {activeTab === "Shipping & Returns" && (
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
            <p>Standard delivery in 3–5 business days, or Express delivery in 1–2 business days.</p>
            <p>Free standard shipping on all orders over $50.</p>
            <p>Not the right fit? Return it within 30 days of delivery for a full refund.</p>
          </div>
        )}
      </div>
    </div>
  );
}
