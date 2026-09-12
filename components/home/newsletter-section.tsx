import { Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-secondary py-14 sm:py-18">
      <div className="absolute inset-0 bg-linear-to-br from-[#FF6A3D]/20 via-transparent to-[#6D5DF6]/30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <Mail className="size-6 text-white" />
        </span>
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="max-w-md text-sm text-white/75 sm:text-base">
          Subscribe to our newsletter for exclusive deals, new arrivals and style inspiration.
        </p>
        <NewsletterForm dark />
      </Container>
    </section>
  );
}
