import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  LayoutDashboard,
  Megaphone,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  Users,
  ShoppingCart,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  enabled: boolean;
}

export interface AdminNavSection {
  label: string;
  icon: LucideIcon;
  href?: string;
  enabled: boolean;
  items?: AdminNavItem[];
}

/**
 * Full planned Admin Dashboard information architecture. `enabled: false`
 * entries render as disabled "Soon" rows instead of dead links until their
 * pages are built — the auth/verification work landing now covers every
 * route here (proxy.ts + requireAdmin()), so enabling a section later is
 * just adding its page, not touching the security layer.
 */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin", enabled: true },
  {
    label: "Catalog",
    icon: Boxes,
    enabled: false,
    items: [
      { label: "Products", href: "/admin/products", enabled: true },
      { label: "Categories", href: "/admin/categories", enabled: true },
      { label: "Brands", href: "/admin/brands", enabled: false },
      { label: "Attributes", href: "/admin/attributes", enabled: false },
      { label: "Inventory", href: "/admin/inventory", enabled: false },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    enabled: false,
    items: [
      { label: "All Orders", href: "/admin/orders", enabled: true },
      { label: "Pending", href: "/admin/orders?status=pending", enabled: true },
      { label: "Processing", href: "/admin/orders?status=processing", enabled: true },
      { label: "Shipped", href: "/admin/orders?status=shipped", enabled: true },
      { label: "Delivered", href: "/admin/orders?status=delivered", enabled: true },
      { label: "Cancelled", href: "/admin/orders?status=cancelled", enabled: true },
      { label: "Returns", href: "/admin/orders?status=returned", enabled: true },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    enabled: false,
    items: [
      { label: "All Customers", href: "/admin/customers", enabled: false },
      { label: "Customer Groups", href: "/admin/customers/groups", enabled: false },
      { label: "Reviews", href: "/admin/reviews", enabled: false },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    enabled: false,
    items: [
      { label: "Coupons", href: "/admin/marketing/coupons", enabled: false },
      { label: "Discounts", href: "/admin/marketing/discounts", enabled: false },
      { label: "Campaigns", href: "/admin/marketing/campaigns", enabled: false },
      { label: "Banners", href: "/admin/marketing/banners", enabled: false },
      { label: "Promotions", href: "/admin/marketing/promotions", enabled: false },
    ],
  },
  {
    label: "Content",
    icon: FileText,
    enabled: false,
    items: [
      { label: "Homepage", href: "/admin/content/homepage", enabled: false },
      { label: "Pages", href: "/admin/content/pages", enabled: false },
      { label: "FAQ", href: "/admin/content/faq", enabled: false },
      { label: "Announcements", href: "/admin/content/announcements", enabled: false },
    ],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    enabled: false,
    items: [
      { label: "Sales", href: "/admin/analytics/sales", enabled: false },
      { label: "Orders", href: "/admin/analytics/orders", enabled: false },
      { label: "Customers", href: "/admin/analytics/customers", enabled: false },
      { label: "Products", href: "/admin/analytics/products", enabled: false },
      { label: "Revenue", href: "/admin/analytics/revenue", enabled: false },
    ],
  },
  {
    label: "Administration",
    icon: ShieldCheck,
    enabled: false,
    items: [
      { label: "Admin Users", href: "/admin/administration/users", enabled: false },
      { label: "Roles", href: "/admin/administration/roles", enabled: false },
      { label: "Permissions", href: "/admin/administration/permissions", enabled: false },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    enabled: false,
    items: [
      { label: "Store Settings", href: "/admin/settings/store", enabled: false },
      { label: "Payment", href: "/admin/settings/payment", enabled: false },
      { label: "Shipping", href: "/admin/settings/shipping", enabled: false },
      { label: "Tax", href: "/admin/settings/tax", enabled: false },
      { label: "Notifications", href: "/admin/settings/notifications", enabled: false },
      { label: "Security", href: "/admin/settings/security", enabled: false },
    ],
  },
];
