import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function HomeSection({
  children,
  alt = false,
  className,
}: {
  children: ReactNode;
  alt?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("py-12 sm:py-16", alt && "bg-surface-alt/60")}>
      <Container className={cn("flex flex-col gap-8", className)}>{children}</Container>
    </section>
  );
}
