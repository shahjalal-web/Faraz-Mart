import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageSearch } from "lucide-react";

export function ProductScrollRow({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Check back soon — new products are added regularly."
      />
    );
  }

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-5 sm:px-0 [scrollbar-width:thin]">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          className="w-[168px] shrink-0 snap-start animate-fade-in-up sm:w-[240px]"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        />
      ))}
    </div>
  );
}
