"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types/category";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Modal } from "@/components/ui/modal";

/** Mobile-only "Filters" trigger that opens the same FilterSidebar in a modal. */
export function MobileFilterButton({
  categories,
  availableBrands,
}: {
  categories?: Category[];
  availableBrands: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-button border border-border bg-surface px-4 text-sm font-semibold text-foreground lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filters" className="max-w-sm">
        <div className="max-h-[80vh] overflow-y-auto p-5 pt-14">
          <FilterSidebar categories={categories} availableBrands={availableBrands} className="border-0 p-0" />
        </div>
      </Modal>
    </>
  );
}
