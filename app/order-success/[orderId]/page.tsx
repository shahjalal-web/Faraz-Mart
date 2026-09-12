"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, PackageX } from "lucide-react";
import { getOrderById } from "@/lib/services/order-service";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderLineItem } from "@/components/order/order-line-item";

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;
    getOrderById(orderId).then((result) => {
      if (!isCancelled) setOrder(result);
    });
    return () => {
      isCancelled = true;
    };
  }, [orderId]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          description="We couldn't find that order. It may have been placed on a different device."
          action={
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              Continue Shopping
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="flex flex-col items-center gap-6 py-12">
      <span className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="size-9" />
      </span>
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Order Placed Successfully!</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Thank you, {order.customerName.split(" ")[0]}. A confirmation has been sent to {order.customerEmail}.
        </p>
      </div>

      <div className="w-full max-w-xl rounded-card border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-muted-foreground">Order Number</span>
          <span className="font-heading font-bold text-foreground">{order.id}</span>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {order.items.map((item, index) => (
            <OrderLineItem key={`${item.productId}-${index}`} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-bold text-foreground">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={`/account/orders/${order.id}`} className={buttonVariants({ variant: "primary" })}>
          Track Order
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Continue Shopping
        </Link>
      </div>
    </Container>
  );
}
