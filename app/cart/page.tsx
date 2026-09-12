"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { OrderSummary } from "@/components/cart/order-summary";

export default function CartPage() {
  const { items, clearCart } = useCart();

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          action={
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              Continue Shopping
            </Link>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface px-5">
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.color ?? ""}-${item.size ?? ""}`} item={item} />
            ))}
            <div className="flex justify-end py-4">
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-danger"
              >
                <Trash2 className="size-4" /> Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <OrderSummary ctaLabel="Proceed to Checkout" ctaHref="/checkout" />
          </div>
        </div>
      )}
    </Container>
  );
}
