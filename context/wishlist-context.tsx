"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { WishlistItem } from "@/types/cart";

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => boolean;
  removeItem: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "fajarmart-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // One-time hydration of persisted wishlist state from localStorage, which isn't
  // available during SSR — this can't be a lazy useState initializer without
  // causing a hydration mismatch, so the one-shot setState calls here are intentional.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Ignore malformed/unavailable storage — wishlist just starts empty.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const isWishlisted = (productId: string) => items.some((item) => item.productId === productId);

  /** Returns the resulting state: true if the item is now wishlisted, false if removed. */
  const toggleWishlist = (item: WishlistItem): boolean => {
    let added = false;
    setItems((prev) => {
      const exists = prev.some((entry) => entry.productId === item.productId);
      if (exists) {
        added = false;
        return prev.filter((entry) => entry.productId !== item.productId);
      }
      added = true;
      return [...prev, item];
    });
    return added;
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
