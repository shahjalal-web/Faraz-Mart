import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View All",
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("flex flex-col gap-2", align === "center" && "items-center")}>
        {eyebrow && (
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {viewAllLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
