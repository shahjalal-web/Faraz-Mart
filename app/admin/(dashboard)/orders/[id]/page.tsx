"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Banknote, CreditCard, MapPin, PackageX, Smartphone } from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/lib/services/order-service";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus, type PaymentMethod } from "@/types/order";

const ALL_ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants, Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderById(id).then(setOrder);
  }, [id]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description="No order matches this id."
        action={
          <Link href="/admin/orders" className={buttonVariants({ variant: "primary" })}>
            Back to Orders
          </Link>
        }
      />
    );
  }

  const payment = PAYMENT_LABELS[order.paymentMethod];
  const PaymentIcon = payment.icon;

  const handleStatusUpdate = async () => {
    if (!pendingStatus || pendingStatus === order.status) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateOrderStatus(order.id, pendingStatus);
      setOrder(updated);
      setPendingStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)} by {order.customerName} ({order.customerEmail})
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-card border border-border bg-surface-alt/40 p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-status" className="text-sm font-semibold text-foreground">
            Update status
          </label>
          <Select
            id="order-status"
            className="w-56"
            value={pendingStatus ?? order.status}
            onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
          >
            {ALL_ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>
        <Button
          type="button"
          onClick={handleStatusUpdate}
          disabled={isSaving || !pendingStatus || pendingStatus === order.status}
        >
          {isSaving ? "Saving..." : "Save Status"}
        </Button>
        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}
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
    </div>
  );
}
