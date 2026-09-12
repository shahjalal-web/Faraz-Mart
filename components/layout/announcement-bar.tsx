import { Sparkles } from "lucide-react";

const MESSAGES = [
  "Free delivery on orders over $50",
  "New arrivals dropping every week",
  "Flash deals up to 60% off — while stock lasts",
];

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-brand bg-[length:200%_200%] animate-gradient-pan text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 overflow-hidden px-4 text-xs font-medium sm:text-sm">
        <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
        <p className="truncate">{MESSAGES[0]}</p>
        <span className="hidden sm:inline text-white/60">•</span>
        <p className="hidden sm:block truncate">{MESSAGES[1]}</p>
        <span className="hidden md:inline text-white/60">•</span>
        <p className="hidden md:block truncate">{MESSAGES[2]}</p>
      </div>
    </div>
  );
}
