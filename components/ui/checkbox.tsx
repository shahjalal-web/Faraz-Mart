import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground select-none"
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn("size-4.5 rounded border-border text-primary focus:ring-primary/40 focus:outline-none", className)}
        {...props}
      />
      {label}
    </label>
  )
);
Checkbox.displayName = "Checkbox";
