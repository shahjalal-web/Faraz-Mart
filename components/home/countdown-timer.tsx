"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBox({ value, label, dark }: { value: number; label: string; dark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-button text-lg font-bold tabular-nums sm:h-14 sm:w-14 sm:text-xl",
          dark ? "bg-white/15 text-white backdrop-blur-sm" : "bg-foreground text-background"
        )}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className={cn("text-[10px] font-medium uppercase tracking-wide", dark ? "text-white/70" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

const ZERO_TIME_LEFT: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function CountdownTimer({ target, dark = false }: { target: string; dark?: boolean }) {
  // Server always renders zeros (no access to "now"); the effect then starts a
  // one-second tick on the client. A ticking clock has no external store to
  // subscribe to ahead of time, so this one-shot + interval setState is intentional.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME_LEFT);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="flex items-center gap-2 sm:gap-3" role="timer" aria-live="off">
      <TimeBox value={timeLeft.days} label="Days" dark={dark} />
      <span className={cn("pb-4 text-lg font-bold", dark ? "text-white/50" : "text-muted-foreground")}>:</span>
      <TimeBox value={timeLeft.hours} label="Hrs" dark={dark} />
      <span className={cn("pb-4 text-lg font-bold", dark ? "text-white/50" : "text-muted-foreground")}>:</span>
      <TimeBox value={timeLeft.minutes} label="Min" dark={dark} />
      <span className={cn("pb-4 text-lg font-bold", dark ? "text-white/50" : "text-muted-foreground")}>:</span>
      <TimeBox value={timeLeft.seconds} label="Sec" dark={dark} />
    </div>
  );
}
