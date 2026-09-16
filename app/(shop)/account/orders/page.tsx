"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { getMyOrders } from "@/lib/services/order-service";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getMyOrders().then((result) => {
      setOrders(result);
    });
  }, []);

  if (orders === null) return null;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Breadcrumb items={[{ label: "My Orders" }]} />
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="You haven't placed any orders yet"
          description="Once you place an order, you'll be able to track it here."
          action={
            <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface px-5">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-5 transition-colors hover:bg-surface-alt/50"
            >
              <div className="flex flex-col gap-1">
                <span className="font-heading font-bold text-foreground">{order.id}</span>
                <span className="text-xs text-muted-foreground">
                  Placed on {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
