import type { Product } from "@/types/product";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductScrollRow } from "@/components/product/product-scroll-row";
import { TrendingUp } from "lucide-react";

export function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <HomeSection alt>
      <SectionHeading
        eyebrow={
          <>
            <TrendingUp className="size-3.5" /> Customer Favorites
          </>
        }
        title="Best Sellers"
        description="The most-loved products across Faraz Mart, ranked by real orders."
        viewAllHref="/shop"
      />
      <ProductScrollRow products={products} />
    </HomeSection>
  );
}
