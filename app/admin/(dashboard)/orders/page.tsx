"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";
import { getOrders } from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function AdminOrdersList() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") as OrderStatus | null;
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setListError(err instanceof Error ? err.message : "Failed to load orders."));
  }, []);

  const needle = search.trim().toLowerCase();
  const filtered = (orders ?? [])
    .filter((o) => !statusFilter || o.status === statusFilter)
    .filter((o) => !needle || o.id.toLowerCase().includes(needle) || o.customerName.toLowerCase().includes(needle) || o.customerEmail.toLowerCase().includes(needle));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Orders{statusFilter ? ` — ${statusFilter}` : ""}</h1>
        <p className="text-sm text-muted-foreground">{orders ? `${filtered.length} shown` : "Loading..."}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by order id, name or email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {listError && (
        <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {listError}
        </p>
      )}

      {orders && filtered.length === 0 ? (
        <EmptyState icon={Search} title="No orders found" description="Try a different search or status filter." />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-card border border-border bg-surface px-5">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-5 transition-colors hover:bg-surface-alt/50"
            >
              <div className="flex flex-col gap-1">
                <span className="font-heading font-bold text-foreground">{order.id}</span>
                <span className="text-xs text-muted-foreground">
                  {order.customerName} · {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
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
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrdersList />
    </Suspense>
  );
}
