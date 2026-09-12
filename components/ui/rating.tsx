import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviewCount,
  size = "sm",
  className,
}: {
  value: number;
  reviewCount?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const starSize = size === "xs" ? "size-3" : size === "md" ? "size-5" : "size-3.5";
  const textSize = size === "xs" ? "text-xs" : size === "md" ? "text-sm" : "text-xs";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(value);
          return (
            <Star
              key={index}
              className={cn(starSize, filled ? "fill-star text-star" : "fill-transparent text-border")}
              strokeWidth={filled ? 0 : 1.5}
            />
          );
        })}
      </div>
      <span className={cn("sr-only")}>{value.toFixed(1)} out of 5 stars</span>
      {reviewCount !== undefined ? (
        <span className={cn(textSize, "text-muted-foreground")}>({reviewCount})</span>
      ) : (
        <span className={cn(textSize, "text-muted-foreground")}>{value.toFixed(1)}</span>
      )}
    </div>
  );
}
