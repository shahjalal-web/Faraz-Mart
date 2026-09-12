"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { iconForCategory } from "@/lib/visual";
import { formatPrice } from "@/lib/utils";
import { MediaTile } from "@/components/ui/media-tile";
import { QuantitySelector } from "@/components/product/quantity-selector";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const Icon = iconForCategory(item.categoryId);

  const handleRemove = () => {
    removeItem(item.productId, item.color, item.size);
    showToast(`${item.name} removed from cart`, "info");
  };

  const handleSaveForLater = () => {
    toggleWishlist({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      thumbnail: item.thumbnail,
      categoryId: item.categoryId,
      price: item.price,
    });
    removeItem(item.productId, item.color, item.size);
    showToast(`${item.name} saved to wishlist`, "success");
  };

  return (
    <div className="flex gap-4 py-5">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <MediaTile seed={item.thumbnail} icon={Icon} className="size-24 rounded-button sm:size-28" iconClassName="size-9" />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="font-semibold text-foreground hover:text-primary">
            {item.name}
          </Link>
          <span className="shrink-0 font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
        </div>

        {(item.color || item.size) && (
          <p className="text-xs text-muted-foreground">
            {item.color && <span>Color: {item.color}</span>}
            {item.color && item.size && <span> · </span>}
            {item.size && <span>Size: {item.size}</span>}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantitySelector
            quantity={item.quantity}
            max={item.stock}
            onChange={(next) => updateQuantity(item.productId, next, item.color, item.size)}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveForLater}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <Heart className="size-3.5" /> Save for later
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${item.name}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-danger"
            >
              <Trash2 className="size-3.5" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
