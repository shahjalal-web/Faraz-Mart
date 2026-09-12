"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { Rating } from "@/components/ui/rating";
import { PriceDisplay } from "@/components/ui/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { calculateDiscountPercent, cn } from "@/lib/utils";

const STOCK_LABEL: Record<Product["stockStatus"], { label: string; variant: "success" | "warning" | "danger" }> = {
  "in-stock": { label: "In Stock", variant: "success" },
  "low-stock": { label: "Low Stock", variant: "warning" },
  "out-of-stock": { label: "Out of Stock", variant: "danger" },
};

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.value ?? null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value ?? null);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isOutOfStock = product.stockStatus === "out-of-stock";
  const wishlisted = isWishlisted(product.id);
  const discount = product.salePrice ? calculateDiscountPercent(product.price, product.salePrice) : 0;

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
      color: selectedColor ?? undefined,
      size: selectedSize ?? undefined,
    });
    showToast(`${product.name} added to cart`, "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
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

  const stock = STOCK_LABEL[product.stockStatus];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {discount > 0 && <Badge variant="danger">-{discount}% OFF</Badge>}
        {product.isNewArrival && <Badge variant="success">New Arrival</Badge>}
        {product.isBestSeller && <Badge variant="dark">Best Seller</Badge>}
      </div>

      <div>
        <p className="text-sm font-medium text-primary">{product.brand}</p>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a href="#reviews" className="transition-opacity hover:opacity-80">
          <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
        </a>
        <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
      </div>

      <PriceDisplay price={product.price} salePrice={product.salePrice} size="lg" />

      <p className="text-sm text-muted-foreground sm:text-base">{product.shortDescription}</p>

      <Badge variant={stock.variant} className="w-fit">
        {stock.label}
        {product.stockStatus !== "out-of-stock" && ` — ${product.stock} available`}
      </Badge>

      {product.colors && product.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                aria-label={color.value}
                aria-pressed={selectedColor === color.value}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full border-2 transition-all",
                  selectedColor === color.value ? "border-primary" : "border-transparent hover:border-border"
                )}
              >
                <span className="size-7 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                {selectedColor === color.value && (
                  <Check className="absolute size-3.5 text-white mix-blend-difference" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Size{selectedSize ? `: ${selectedSize}` : ""}</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size.value)}
                aria-pressed={selectedSize === size.value}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-button border px-3 text-sm font-medium transition-colors",
                  selectedSize === size.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-primary"
                )}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <QuantitySelector quantity={quantity} max={Math.max(1, product.stock)} onChange={setQuantity} />
        <div className="flex flex-1 items-center gap-2">
          <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1">
            <ShoppingCart className="size-4.5" />
            Add to Cart
          </Button>
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="flex size-12 shrink-0 items-center justify-center rounded-button border border-border text-foreground transition-colors hover:text-accent"
          >
            <Heart className={cn("size-5", wishlisted && "fill-accent text-accent")} />
          </button>
        </div>
      </div>

      <Button variant="dark" size="lg" onClick={handleBuyNow} disabled={isOutOfStock} fullWidth>
        <Zap className="size-4.5" />
        Buy Now
      </Button>

      <div className="mt-2 flex flex-col gap-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Truck className="size-4 text-primary" /> Free delivery on orders over $50
        </span>
        <span className="flex items-center gap-2">
          <RotateCcw className="size-4 text-primary" /> 30-day easy returns
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" /> Secure checkout, every time
        </span>
      </div>
    </div>
  );
}
