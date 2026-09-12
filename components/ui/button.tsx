import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow-primary hover:-translate-y-0.5",
  secondary:
    "bg-secondary text-secondary-foreground hover:opacity-90 hover:-translate-y-0.5",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-alt hover:-translate-y-0.5",
  ghost: "bg-transparent text-foreground hover:bg-surface-alt",
  dark: "bg-foreground text-background hover:opacity-90 hover:-translate-y-0.5",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2",
  icon: "size-10 p-0",
};

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonVariantOptions = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-button font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantOptions {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
