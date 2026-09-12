import { BadgeCheck, Quote } from "lucide-react";
import type { Testimonial } from "@/types/review";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Rating } from "@/components/ui/rating";
import { gradientForSeed } from "@/lib/visual";
import { cn } from "@/lib/utils";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <HomeSection alt>
      <SectionHeading title="What Our Customers Say" align="center" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <Quote className="size-6 text-primary/40" />
            <p className="flex-1 text-sm text-foreground/90">&ldquo;{testimonial.comment}&rdquo;</p>
            <div className="flex items-center gap-3 pt-2">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white",
                  gradientForSeed(testimonial.id)
                )}
              >
                {testimonial.avatar}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  {testimonial.customerName}
                  {testimonial.isVerifiedPurchase && (
                    <BadgeCheck className="size-4 text-info" aria-label="Verified purchase" />
                  )}
                </span>
                <Rating value={testimonial.rating} size="xs" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
