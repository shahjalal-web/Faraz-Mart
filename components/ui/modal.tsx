"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const isHydrated = useHydrated();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isHydrated) return null;

  // Rendered via a portal straight into <body> so a `fixed` overlay is never
  // clipped or repositioned by an ancestor with backdrop-filter/transform
  // (either of which creates a new containing block for fixed descendants).
  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full max-w-lg animate-fade-in-up rounded-card border border-border bg-surface shadow-card-hover",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-surface-alt text-foreground transition-colors hover:bg-border"
        >
          <X className="size-4.5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
