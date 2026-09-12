import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  salePrice,
  size = "md",
  className,
}: {
  price: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasDiscount = typeof salePrice === "number" && salePrice < price;
  const currentSize = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";
  const previousSize = size === "lg" ? "text-base" : "text-sm";

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn(currentSize, "font-bold text-foreground")}>
        {formatPrice(hasDiscount ? salePrice! : price)}
      </span>
      {hasDiscount && (
        <span className={cn(previousSize, "text-muted-foreground line-through")}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}
