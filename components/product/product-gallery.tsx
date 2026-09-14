"use client";

import { useState } from "react";
import { MediaTile } from "@/components/ui/media-tile";
import { iconForCategory } from "@/lib/visual";
import { cn } from "@/lib/utils";

/**
 * Faraz Mart has no product photography yet, so every angle reuses the same
 * dawn-gradient tile (kept visually consistent) with a subtle icon rotation
 * per frame to make switching thumbnails feel tangible.
 *
 * Takes a plain `categoryId` string (not a resolved icon component) because
 * this is a Client Component rendered from a Server Component page — a
 * component/function reference can't cross that boundary as a prop, only
 * serializable data can.
 */
export function ProductGallery({
  seed,
  categoryId,
  frameCount,
  productName,
}: {
  seed: string;
  categoryId: string;
  frameCount: number;
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const frames = Math.max(1, frameCount);
  const icon = iconForCategory(categoryId);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-card border border-border">
        <MediaTile
          seed={seed}
          icon={icon}
          className="aspect-square w-full"
          iconClassName={cn("size-28 transition-transform duration-500")}
        />
      </div>

      {frames > 1 && (
        <div className="flex gap-3" role="tablist" aria-label={`${productName} images`}>
          {Array.from({ length: frames }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-button border-2 transition-all sm:size-20",
                activeIndex === index ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <MediaTile seed={seed} icon={icon} className="size-full" iconClassName="size-8" pattern={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
