import Link from "next/link";
import { Flame } from "lucide-react";
import type { Product } from "@/types/product";
import { HomeSection } from "@/components/home/home-section";
import { ProductScrollRow } from "@/components/product/product-scroll-row";
import { CountdownTimer } from "@/components/home/countdown-timer";
import { buttonVariants } from "@/components/ui/button";

export function FlashSaleSection({
  products,
  deadline,
}: {
  products: Product[];
  deadline: string | null;
}) {
  if (products.length === 0 || !deadline) return null;

  return (
    <HomeSection>
      <div className="relative overflow-hidden rounded-card bg-secondary p-6 sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#FF6A3D]/25 via-transparent to-[#6D5DF6]/40" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow-primary">
                <Flame className="size-5" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Flash Sale</h2>
                <p className="text-sm text-white/70">Prices this good won&apos;t last — grab them now.</p>
              </div>
            </div>
            <CountdownTimer target={deadline} dark />
          </div>

          <ProductScrollRow products={products} />

          <Link
            href="/deals"
            className={buttonVariants({ variant: "primary", size: "md", className: "w-fit" })}
          >
            View All Flash Deals
          </Link>
        </div>
      </div>
    </HomeSection>
  );
}
