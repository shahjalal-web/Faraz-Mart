"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, RotateCcw, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import type { HeroSlide } from "@/types/content";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const TRUST_POINTS = [
  { icon: Truck, label: "Free delivery over $50" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: RotateCcw, label: "Easy 30-day returns" },
];

const SLIDE_INTERVAL_MS = 6000;

export function HeroSection({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[activeIndex];
  if (!slide) return null;

  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      <div
        key={slide.id}
        className={cn(
          "absolute inset-0 bg-linear-to-br bg-[length:200%_200%] animate-gradient-pan transition-opacity duration-700",
          slide.gradient
        )}
        aria-hidden="true"
      />

      {/* decorative blurred orbs */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-96 rounded-full bg-black/10 blur-3xl" aria-hidden="true" />

      <Container className="relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div key={`${slide.id}-copy`} className="flex flex-col items-start gap-5 animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            {slide.eyebrow}
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {slide.title}
            <br />
            <span className="text-white/90">{slide.highlight}</span>
          </h1>
          <p className="max-w-md text-base text-white/85 sm:text-lg">{slide.description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={slide.ctaHref} className={cn(buttonVariants({ variant: "dark", size: "lg" }), "shadow-xl")}>
              <Zap className="size-4.5" />
              {slide.ctaLabel}
            </Link>
            <Link
              href={slide.secondaryCtaHref}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "border-white/40 text-white hover:bg-white/10 hover:text-white",
              })}
            >
              {slide.secondaryCtaLabel}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 sm:text-sm">
                <Icon className="size-4" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden h-80 items-center justify-center lg:flex">
          <div className="absolute size-64 rounded-[2.5rem] bg-white/10 backdrop-blur-md rotate-6 shadow-2xl" aria-hidden="true" />
          <div className="relative flex size-64 -rotate-6 flex-col items-center justify-center gap-3 rounded-[2.5rem] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md shadow-2xl">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white/20">
              <Headphones className="size-8 text-white" strokeWidth={1.5} />
            </span>
            <p className="font-heading text-lg font-bold text-white">Trending Now</p>
            <p className="text-xs text-white/75">Top picks across every category</p>
          </div>

          <div className="absolute -right-2 top-2 flex animate-float items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-2xl">
            <Truck className="size-5 text-primary" />
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">Free Delivery</p>
              <p className="text-[10px] text-muted-foreground">On orders $50+</p>
            </div>
          </div>

          <div className="absolute -left-4 bottom-6 flex size-24 animate-float-delayed animate-pulse-glow flex-col items-center justify-center rounded-full bg-white text-center shadow-2xl">
            <span className="font-heading text-xl font-extrabold text-primary">60%</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Off Today</span>
          </div>
        </div>
      </Container>

      {slides.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-2 pb-8">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-1.5 rounded-pill bg-white/40 transition-all duration-300 hover:bg-white/70",
                index === activeIndex ? "w-8 bg-white" : "w-1.5"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
