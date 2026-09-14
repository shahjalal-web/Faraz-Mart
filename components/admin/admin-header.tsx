"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Modal } from "@/components/ui/modal";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminRole } from "@/lib/auth/jwt";

const ROLE_LABELS: Record<AdminRole, string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
  manager: "Manager",
  "order-manager": "Order Manager",
  "product-manager": "Product Manager",
  "support-agent": "Support Agent",
};

export function AdminHeader({ name, role }: { name: string; role: AdminRole }) {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open admin menu"
        className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface-alt lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <p className="hidden font-heading text-sm font-bold text-foreground lg:block">Admin Dashboard</p>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-pill border border-border py-1 pl-1 pr-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-4" />
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold leading-tight text-foreground">{name}</span>
            <span className="text-[10px] leading-tight text-muted-foreground">{ROLE_LABELS[role]}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Log out"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
        >
          <LogOut className="size-4.5" />
        </button>
      </div>

      <Modal isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} title="Admin menu" className="max-w-xs">
        <div className="pt-12">
          <AdminSidebar className="flex w-full flex-col" />
        </div>
      </Modal>
    </header>
  );
}
