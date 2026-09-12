"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      suppressHydrationWarning
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-alt hover:text-primary",
        className
      )}
    >
      <Sun
        suppressHydrationWarning
        className={cn(
          "absolute size-5 transition-all duration-300",
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )}
      />
      <Moon
        suppressHydrationWarning
        className={cn(
          "absolute size-5 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        )}
      />
    </button>
  );
}
