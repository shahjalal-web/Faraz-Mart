import type { Product } from "@/types/product";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { Star } from "lucide-react";

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <HomeSection alt>
      <SectionHeading
        eyebrow={
          <>
            <Star className="size-3.5" /> Handpicked For You
          </>
        }
        title="Featured Products"
        description="A curated edit of the products our customers love most right now."
        viewAllHref="/shop"
      />
      <ProductGrid products={products} />
    </HomeSection>
  );
}
