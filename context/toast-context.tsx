"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-success/30 [&_svg]:text-success",
  error: "border-danger/30 [&_svg]:text-danger",
  info: "border-info/30 [&_svg]:text-info",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => {
          const Icon = VARIANT_ICON[toast.variant];
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-sm animate-toast-in",
                VARIANT_STYLES[toast.variant]
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-alt hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
