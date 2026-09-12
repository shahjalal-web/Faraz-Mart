"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Flame,
  Heart,
  Menu,
  Package,
  Sparkles,
  Store,
  User,
  X,
} from "lucide-react";
import type { Category } from "@/types/category";
import { iconForCategory } from "@/lib/visual";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

const NAV_LINKS = [
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/deals", label: "Deals", icon: Flame },
  { href: "/new-arrivals", label: "New Arrivals", icon: Sparkles },
];

const ACCOUNT_LINKS = [
  { href: "/account", label: "My Account", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = useHydrated();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt lg:hidden"
      >
        <Menu className="size-6" />
      </button>

      {/*
        Portaled straight into <body>: the header this button lives in has
        backdrop-blur, which creates a new containing block for `fixed`
        descendants — without the portal this drawer would be clipped to the
        header's own height instead of the full viewport.
      */}
      {isHydrated &&
        createPortal(
          <>
            <div
              className={cn(
                "fixed inset-0 z-100 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className={cn(
                "fixed inset-y-0 right-0 z-100 flex w-[85%] max-w-sm flex-col bg-surface shadow-card-hover transition-transform duration-300 ease-out lg:hidden",
                isOpen ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <Logo />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-surface-alt"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <nav className="flex flex-col gap-1" aria-label="Primary">
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-button px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt hover:text-primary"
                    >
                      <Icon className="size-5" />
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Categories
                  </p>
                  <div className="flex flex-col gap-1">
                    {categories.map((category) => {
                      const Icon = iconForCategory(category.slug);
                      return (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt hover:text-primary"
                        >
                          <Icon className="size-4.5 text-primary" strokeWidth={1.75} />
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Account
                  </p>
                  <nav className="flex flex-col gap-1" aria-label="Account">
                    {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt hover:text-primary"
                      >
                        <Icon className="size-4.5" />
                        {label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
