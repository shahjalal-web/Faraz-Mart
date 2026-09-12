"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ToastProvider } from "@/context/toast-context";
import { QuickViewProvider } from "@/context/quick-view-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>{children}</QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
