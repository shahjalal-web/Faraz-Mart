import { cookies } from "next/headers";
import { AlertTriangle, DollarSign, Package, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getProducts } from "@/lib/services/product-service";
import { getTopLevelCategories } from "@/lib/services/category-service";
import { getOrders } from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;

  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getTopLevelCategories(),
    getOrders(),
  ]);

  const lowStockCount = products.filter((p) => p.stockStatus === "low-stock").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back, {admin?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening across Faraz Mart today.</p>
      </div>

      <div className="flex items-center gap-3 rounded-card border border-success/30 bg-success/5 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <ShieldCheck className="size-4.5" />
        </span>
        <p className="text-sm text-foreground">
          You&apos;re signed in as <span className="font-semibold">{admin?.name}</span> with{" "}
          <span className="font-semibold capitalize">{admin?.role.replace("-", " ")}</span> access. This page and
          every <code className="rounded bg-surface-alt px-1 py-0.5 text-xs">/api/admin/**</code> request are
          verified independently — page navigation via a proxy check, data requests via a second server-side check.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(revenue)} hint={`${orders.length} orders`} accent="success" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(orders.length)} accent="primary" />
        <StatCard icon={Users} label="Total Customers" value="—" hint="Customer accounts coming soon" accent="primary" />
        <StatCard icon={Package} label="Total Products" value={String(products.length)} hint={`${categories.length} categories`} accent="primary" />
        <StatCard icon={AlertTriangle} label="Pending Orders" value={String(pendingOrders)} accent="warning" />
        <StatCard icon={AlertTriangle} label="Low Stock Products" value={String(lowStockCount)} accent="danger" />
      </div>

      <div className="rounded-card border border-dashed border-border bg-surface-alt/40 p-6 text-sm text-muted-foreground">
        Product, order and customer management screens are next — the sidebar already shows the full planned
        layout. Everything under it will use the same two-layer admin verification already wired up here.
      </div>
    </div>
  );
}
