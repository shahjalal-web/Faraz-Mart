"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { iconForCategory } from "@/lib/visual";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { Modal } from "@/components/ui/modal";
import { MediaTile } from "@/components/ui/media-tile";
import { Rating } from "@/components/ui/rating";
import { PriceDisplay } from "@/components/ui/price-display";
import { ProductBadges } from "@/components/product/product-badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!product) return null;

  const Icon = iconForCategory(product.subcategoryId ?? product.categoryId);
  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stockStatus === "out-of-stock";

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      categoryId: product.subcategoryId ?? product.categoryId,
      price: product.salePrice ?? product.price,
      stock: product.stock,
      quantity,
    });
    showToast(`${product.name} added to cart`, "success");
    handleClose();
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
    <Modal isOpen={!!product} onClose={handleClose} title={product.name} className="max-w-2xl overflow-hidden p-0">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="relative aspect-square sm:aspect-auto">
          <MediaTile seed={product.thumbnail} icon={Icon} className="size-full" iconClassName="size-20" />
          <ProductBadges product={product} className="absolute left-4 top-4 flex flex-col gap-1.5" />
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span className="text-xs font-medium text-muted-foreground">{product.brand}</span>
          <h3 className="font-heading text-xl font-bold text-foreground">{product.name}</h3>
          <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" />
          <PriceDisplay price={product.price} salePrice={product.salePrice} size="lg" />
          <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center rounded-button border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex size-9 items-center justify-center text-foreground transition-colors hover:text-primary"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                className="flex size-9 items-center justify-center text-foreground transition-colors hover:text-primary"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button variant="primary" onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1">
              <ShoppingCart className="size-4" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              className="flex size-11 shrink-0 items-center justify-center rounded-button border border-border text-foreground transition-colors hover:text-accent"
            >
              <Heart className={cn("size-4.5", wishlisted && "fill-accent text-accent")} />
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="pt-1 text-center text-sm font-semibold text-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
