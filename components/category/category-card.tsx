import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/category";
import { iconForCategory } from "@/lib/visual";
import { MediaTile } from "@/components/ui/media-tile";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconForCategory(category.slug);

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <MediaTile
          seed={category.id}
          icon={Icon}
          className="size-full transition-transform duration-500 group-hover:scale-110"
          iconClassName="size-14"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">{category.name}</h3>
          <p className="text-xs text-muted-foreground">{category.productCount} products</p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
