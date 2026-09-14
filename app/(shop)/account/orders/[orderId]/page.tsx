"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Banknote, CreditCard, MapPin, PackageX, Smartphone } from "lucide-react";
import { getOrderById } from "@/lib/services/order-service";
import type { Order, PaymentMethod } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusTimeline } from "@/components/order/order-status-timeline";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { OrderLineItem } from "@/components/order/order-line-item";

const PAYMENT_LABELS: Record<PaymentMethod, { label: string; icon: typeof CreditCard }> = {
  card: { label: "Credit / Debit Card", icon: CreditCard },
  cod: { label: "Cash on Delivery", icon: Banknote },
  "mobile-banking": { label: "Mobile Banking", icon: Smartphone },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
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
          description="We couldn't find that order on this device."
          action={
            <Link href="/account/orders" className={buttonVariants({ variant: "primary" })}>
              Back to My Orders
            </Link>
          }
        />
      </Container>
    );
  }

  const payment = PAYMENT_LABELS[order.paymentMethod];
  const PaymentIcon = payment.icon;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "My Orders", href: "/account/orders" }, { label: order.id }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface px-5">
          {order.items.map((item, index) => (
            <OrderLineItem key={`${item.productId}-${index}`} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
              <MapPin className="size-4 text-primary" /> Shipping Address
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
              <PaymentIcon className="size-4 text-primary" /> Payment Method
            </h2>
            <p className="text-sm text-muted-foreground">{payment.label}</p>
          </div>

          <div className="flex flex-col gap-2 rounded-card border border-border bg-surface p-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
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
            <div className="flex justify-between border-t border-border pt-2 font-heading font-bold text-foreground">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
