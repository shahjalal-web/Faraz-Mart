import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function buildHref(basePath: string, params: Record<string, string | string[] | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => v && search.append(key, v));
    } else if (value) {
      search.set(key, value);
    }
  }
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Renders page-number links that preserve every other active filter/sort param. */
export function Pagination({
  basePath,
  params,
  currentPage,
  totalPages,
}: {
  basePath: string;
  params: Record<string, string | string[] | undefined>;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 pt-4">
      <Link
        href={buildHref(basePath, params, Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-button border border-border text-foreground transition-colors hover:bg-surface-alt",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;
        return (
          <span key={page} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-sm text-muted-foreground">…</span>}
            <Link
              href={buildHref(basePath, params, page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-button text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-surface-alt"
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildHref(basePath, params, Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex size-9 items-center justify-center rounded-button border border-border text-foreground transition-colors hover:bg-surface-alt",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
