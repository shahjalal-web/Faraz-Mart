"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";
import type { Coupon } from "@/types/coupon";
import { validateCoupon } from "@/lib/services/coupon-service";

interface AddToCartInput extends Omit<CartItem, "quantity"> {
  quantity?: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  coupon: Coupon | null;
  /** False until the persisted cart has been read from localStorage — check this before treating an empty cart as final. */
  isHydrated: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "farazmart-cart";
const COUPON_STORAGE_KEY = "farazmart-coupon";

function sameLine(a: CartItem, productId: string, color?: string, size?: string) {
  return a.productId === productId && a.color === color && a.size === size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // One-time hydration of persisted cart state from localStorage, which isn't
  // available during SSR — this can't be a lazy useState initializer without
  // causing a hydration mismatch, so the one-shot setState calls here are intentional.
  useEffect(() => {
    try {
      const storedItems = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedItems) setItems(JSON.parse(storedItems));
      const storedCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon));
    } catch {
      // Ignore malformed/unavailable storage — cart just starts empty.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (coupon) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [coupon, isHydrated]);

  const addItem = (input: AddToCartInput) => {
    const quantity = input.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((item) => sameLine(item, input.productId, input.color, input.size));
      if (existing) {
        return prev.map((item) =>
          sameLine(item, input.productId, input.color, input.size)
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }
      return [...prev, { ...input, quantity }];
    });
  };

  const removeItem = (productId: string, color?: string, size?: string) => {
    setItems((prev) => prev.filter((item) => !sameLine(item, productId, color, size)));
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        sameLine(item, productId, color, size)
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    const match = await validateCoupon(code);
    setCoupon(match);
    return match !== null;
  };

  const removeCoupon = () => setCoupon(null);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        coupon,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
