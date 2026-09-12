import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && (
        <span role="alert" className="text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
