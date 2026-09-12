import Link from "next/link";
import { Sunrise } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2 shrink-0", className)}
      aria-label="Fajar Mart home"
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6] shadow-glow-primary transition-transform duration-300 group-hover:rotate-12"
        )}
      >
        <Sunrise className="size-5 text-white" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-heading text-xl font-bold tracking-tight",
          mono ? "text-current" : "text-foreground"
        )}
      >
        Fajar<span className="text-primary">Mart</span>
      </span>
    </Link>
  );
}
