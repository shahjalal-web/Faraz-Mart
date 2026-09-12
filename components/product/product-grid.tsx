import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
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
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4",
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        />
      ))}
    </div>
  );
}
