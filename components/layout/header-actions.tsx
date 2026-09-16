"use client";

import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-surface-alt hover:text-primary"
    >
      {children}
      {!!count && count > 0 && (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground",
            "animate-fade-in-up"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function HeaderActions() {
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { customer } = useCustomerAuth();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <ThemeToggle className="hidden sm:flex" />
      <IconLink href={customer ? "/account" : "/login"} label="Account">
        <User className="size-5" />
      </IconLink>
      <IconLink href="/account/wishlist" label="Wishlist" count={wishlistItems.length}>
        <Heart className="size-5" />
      </IconLink>
      <IconLink href="/cart" label="Shopping cart" count={itemCount}>
        <ShoppingCart className="size-5" />
      </IconLink>
    </div>
  );
}
