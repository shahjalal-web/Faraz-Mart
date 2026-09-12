import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientForSeed } from "@/lib/visual";

/**
 * Fajar Mart doesn't have product photography yet, so every category and
 * product "image" is a deterministic dawn-gradient tile with a representative
 * icon. Swapping in real photos later is a one-line change per product
 * (just point `thumbnail`/`images` at a URL and render an <Image> instead).
 */
export function MediaTile({
  seed,
  icon: Icon,
  className,
  iconClassName,
  pattern = true,
}: {
  seed: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  pattern?: boolean;
}) {
  const gradient = gradientForSeed(seed);

  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden bg-linear-to-br",
        gradient,
        className
      )}
    >
      {pattern && (
        <>
          <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-10 -left-10 size-36 rounded-full bg-black/10 blur-2xl" aria-hidden="true" />
          <Icon
            className="pointer-events-none absolute -bottom-6 -right-6 size-28 rotate-12 text-white/15"
            strokeWidth={1}
            aria-hidden="true"
          />
        </>
      )}
      <Icon
        className={cn("relative size-10 text-white drop-shadow-sm", iconClassName)}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}
