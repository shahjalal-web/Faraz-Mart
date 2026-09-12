"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import type { ProductSortOption } from "@/types/product";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
  { value: "popularity", label: "Most Popular" },
  { value: "discount", label: "Discount" },
];

export function SortSelect({ value }: { value: ProductSortOption }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", next);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <ArrowUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
      <span className="hidden text-muted-foreground sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Sort products"
        className="h-10 rounded-button border border-border bg-surface px-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
