import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-surface-alt/50 px-6 py-16 text-center",
        className
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-surface text-muted-foreground shadow-card">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-lg font-bold text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
