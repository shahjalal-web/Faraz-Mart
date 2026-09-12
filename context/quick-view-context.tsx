"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import { QuickViewModal } from "@/components/product/quick-view-modal";

interface QuickViewContextValue {
  openQuickView: (product: Product) => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <QuickViewContext.Provider value={{ openQuickView: setActiveProduct }}>
      {children}
      <QuickViewModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within QuickViewProvider");
  return ctx;
}
