import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PromoBanner } from "@/types/content";
import { HomeSection } from "@/components/home/home-section";
import { cn } from "@/lib/utils";

export function PromoBannerSection({ banners }: { banners: PromoBanner[] }) {
  if (banners.length === 0) return null;

  return (
    <HomeSection className="gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.ctaHref}
            className={cn(
              "group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-card bg-linear-to-br p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
              banner.gradient
            )}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
            <h3 className="font-heading text-2xl font-bold text-white">{banner.title}</h3>
            <p className="mt-1 max-w-xs text-sm text-white/85">{banner.description}</p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-foreground transition-transform group-hover:translate-x-1">
              {banner.ctaLabel}
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
