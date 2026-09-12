import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-button border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClasses, "h-11", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, "py-2.5", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";
