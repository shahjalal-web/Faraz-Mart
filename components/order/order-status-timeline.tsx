import { Check, PackageX, RotateCcw } from "lucide-react";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const TERMINAL_NEGATIVE_STATUSES: OrderStatus[] = ["cancelled", "returned", "refunded"];

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (TERMINAL_NEGATIVE_STATUSES.includes(status)) {
    const Icon = status === "returned" ? RotateCcw : PackageX;
    return (
      <div className="flex items-center gap-3 rounded-card border border-danger/30 bg-danger/5 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-danger text-white">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="font-heading text-base font-bold text-foreground">{ORDER_STATUS_LABELS[status]}</p>
          <p className="text-sm text-muted-foreground">This order will not continue through standard delivery.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex flex-col sm:flex-row">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;

        return (
          <li key={step} className="flex flex-1 gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
            {/* Icon + connector column (row on mobile handled by outer flex, column here for the vertical line) */}
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isComplete
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : index + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "w-0.5 flex-1 sm:h-0.5 sm:w-auto",
                    "min-h-6 sm:min-h-0",
                    index < currentIndex ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "pb-6 text-xs font-semibold sm:pb-0 sm:pt-1 sm:text-sm",
                isComplete ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
