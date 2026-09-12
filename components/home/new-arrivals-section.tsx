import type { Product } from "@/types/product";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductScrollRow } from "@/components/product/product-scroll-row";
import { Sparkles } from "lucide-react";

export function NewArrivalsSection({ products }: { products: Product[] }) {
  return (
    <HomeSection>
      <SectionHeading
        eyebrow={
          <>
            <Sparkles className="size-3.5" /> Just Landed
          </>
        }
        title="New Arrivals"
        description="Fresh drops across every category, updated regularly."
        viewAllHref="/new-arrivals"
      />
      <ProductScrollRow products={products} />
    </HomeSection>
  );
}
