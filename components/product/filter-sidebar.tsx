"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { Category } from "@/types/category";
import type { PriceRangeValue } from "@/types/product";
import { cn } from "@/lib/utils";

const PRICE_RANGES: { value: PriceRangeValue; label: string }[] = [
  { value: "under-25", label: "Under $25" },
  { value: "25-50", label: "$25 – $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100-250", label: "$100 – $250" },
  { value: "250-plus", label: "$250 & Above" },
];

const RATINGS = [4, 3, 2, 1];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 first:pt-0 last:border-b-0">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: React.ReactNode;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/90">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 rounded border-border accent-primary"
      />
      {label}
    </label>
  );
}

export function FilterSidebar({
  categories,
  availableBrands,
  className,
}: {
  categories?: Category[];
  availableBrands: string[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activePriceRange = searchParams.get("price") ?? "";
  const activeRating = searchParams.get("rating") ?? "";
  const activeBrands = searchParams.getAll("brand");
  const inStockOnly = searchParams.get("inStock") === "1";
  const onSaleOnly = searchParams.get("onSale") === "1";

  const hasActiveFilters =
    activeCategory || activePriceRange || activeRating || activeBrands.length > 0 || inStockOnly || onSaleOnly;

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const toggleSingleValue = (key: string, value: string) => {
    updateParams((params) => {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
  };

  const toggleBrand = (brand: string) => {
    updateParams((params) => {
      const current = params.getAll("brand");
      params.delete("brand");
      if (current.includes(brand)) {
        current.filter((b) => b !== brand).forEach((b) => params.append("brand", b));
      } else {
        [...current, brand].forEach((b) => params.append("brand", b));
      }
    });
  };

  const toggleFlag = (key: string) => {
    updateParams((params) => {
      if (params.get(key) === "1") {
        params.delete(key);
      } else {
        params.set(key, "1");
      }
    });
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "price", "rating", "brand", "inStock", "onSale", "page"].forEach((key) => params.delete(key));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <aside className={cn("flex flex-col rounded-card border border-border bg-surface p-5", className)}>
      <div className="flex items-center justify-between pb-1">
        <h2 className="font-heading text-base font-bold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <X className="size-3.5" /> Clear All
          </button>
        )}
      </div>

      {categories && categories.length > 0 && (
        <FilterSection title="Category">
          {categories.map((category) => (
            <CheckRow
              key={category.id}
              checked={activeCategory === category.id}
              onChange={() => toggleSingleValue("category", category.id)}
              label={
                <span className="flex flex-1 items-center justify-between gap-2">
                  {category.name}
                  <span className="text-xs text-muted-foreground">{category.productCount}</span>
                </span>
              }
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Price Range">
        {PRICE_RANGES.map((range) => (
          <CheckRow
            key={range.value}
            checked={activePriceRange === range.value}
            onChange={() => toggleSingleValue("price", range.value)}
            label={range.label}
          />
        ))}
      </FilterSection>

      <FilterSection title="Rating">
        {RATINGS.map((rating) => (
          <CheckRow
            key={rating}
            checked={activeRating === String(rating)}
            onChange={() => toggleSingleValue("rating", String(rating))}
            label={`${rating}★ & Up`}
          />
        ))}
      </FilterSection>

      {availableBrands.length > 0 && (
        <FilterSection title="Brand">
          {availableBrands.map((brand) => (
            <CheckRow
              key={brand}
              checked={activeBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Availability">
        <CheckRow checked={inStockOnly} onChange={() => toggleFlag("inStock")} label="In Stock Only" />
        <CheckRow checked={onSaleOnly} onChange={() => toggleFlag("onSale")} label="On Sale" />
      </FilterSection>
    </aside>
  );
}
