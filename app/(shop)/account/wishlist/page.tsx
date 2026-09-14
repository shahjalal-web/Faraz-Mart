"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { getProductsByIds } from "@/lib/services/product-service";
import type { Product } from "@/types/product";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";

export default function WishlistPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[] | null>(null);

  const ids = items.map((item) => item.productId).join(",");

  useEffect(() => {
    let isCancelled = false;
    getProductsByIds(ids ? ids.split(",") : []).then((result) => {
      if (!isCancelled) setProducts(result);
    });
    return () => {
      isCancelled = true;
    };
  }, [ids]);

  const isLoading = products === null;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">My Wishlist</h1>

      {!isLoading && items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love here so you can find them easily later."
          action={
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              Start Shopping
            </Link>
          }
        />
      ) : (
        <ProductGrid products={products ?? []} className="sm:grid-cols-3 lg:grid-cols-4" />
      )}
    </Container>
  );
}
