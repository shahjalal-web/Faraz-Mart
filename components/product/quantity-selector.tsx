"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  quantity,
  max,
  onChange,
  className,
}: {
  quantity: number;
  max: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center rounded-button border border-border", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
