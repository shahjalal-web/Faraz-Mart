"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/types/category";
import { iconForCategory } from "@/lib/visual";
import { cn } from "@/lib/utils";

export function CategoryMegaMenu({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
      >
        Categories
        <ChevronDown className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3 transition-all duration-200",
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="grid grid-cols-2 gap-1 rounded-card border border-border bg-surface p-3 shadow-card-hover">
          {categories.map((category) => {
            const Icon = iconForCategory(category.slug);
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex items-center gap-3 rounded-button px-3 py-2.5 transition-colors hover:bg-surface-alt"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#FF6A3D] to-[#FF3D77] text-white transition-transform group-hover:scale-110">
                  <Icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{category.productCount} products</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
