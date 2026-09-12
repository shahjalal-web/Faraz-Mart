import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Link href="/" className="flex items-center text-muted-foreground transition-colors hover:text-primary">
        <Home className="size-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
            {item.href && !isLast ? (
              <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
