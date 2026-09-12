"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Eye, Heart, Plus } from "lucide-react";
import type { Product } from "@/types/product";
import { iconForCategory } from "@/lib/visual";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useQuickView } from "@/context/quick-view-context";
import { useToast } from "@/context/toast-context";
import { MediaTile } from "@/components/ui/media-tile";
import { Rating } from "@/components/ui/rating";
import { PriceDisplay } from "@/components/ui/price-display";
import { ProductBadges } from "@/components/product/product-badges";

export function ProductCard({
  product,
  className,
  style,
}: {
  product: Product;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = iconForCategory(product.subcategoryId ?? product.categoryId);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stockStatus === "out-of-stock";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      categoryId: product.subcategoryId ?? product.categoryId,
      price: product.salePrice ?? product.price,
      stock: product.stock,
    });
    showToast(`${product.name} added to cart`, "success");
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      categoryId: product.subcategoryId ?? product.categoryId,
      price: product.price,
      salePrice: product.salePrice,
    });
    showToast(added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`, "success");
  };

  return (
    <div
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 block" tabIndex={-1}>
          <MediaTile
            seed={product.thumbnail}
            icon={Icon}
            className="size-full transition-transform duration-500 group-hover:scale-110"
            iconClassName="size-16 sm:size-20"
          />
        </Link>

        <ProductBadges product={product} className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5" />

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-accent"
        >
          <Heart className={cn("size-4.5 transition-colors", wishlisted && "fill-accent text-accent")} />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 justify-center bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-pill bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-card transition-transform hover:scale-105"
          >
            <Eye className="size-3.5" /> Quick View
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-muted-foreground">{product.brand}</span>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} reviewCount={product.reviewCount} size="xs" />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceDisplay price={product.price} salePrice={product.salePrice} size="sm" />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:scale-110 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
