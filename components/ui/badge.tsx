import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "accent" | "success" | "warning" | "danger" | "neutral" | "dark";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  neutral: "bg-surface-alt text-foreground border border-border",
  dark: "bg-foreground text-background",
};

export function Badge({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold leading-none",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
