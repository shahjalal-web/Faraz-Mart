"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Tag, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { calculateOrderTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function OrderSummary({
  shippingMethod = "standard",
  showCouponInput = true,
  ctaLabel,
  ctaHref,
  onCtaClick,
  ctaDisabled = false,
  children,
}: {
  shippingMethod?: "standard" | "express";
  showCouponInput?: boolean;
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  children?: ReactNode;
}) {
  const { itemCount, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const totals = calculateOrderTotals(subtotal, shippingMethod, coupon);

  const handleApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim()) return;
    setIsApplying(true);
    const success = await applyCoupon(code);
    setIsApplying(false);
    if (success) {
      showToast("Coupon applied", "success");
      setCode("");
    } else {
      showToast("Invalid or expired coupon code", "error");
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-6">
      <h2 className="font-heading text-lg font-bold text-foreground">Order Summary</h2>

      {showCouponInput && (
        <div className="flex flex-col gap-2">
          {coupon ? (
            <div className="flex items-center justify-between rounded-button border border-success/30 bg-success/10 px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-success">
                <Tag className="size-3.5" /> {coupon.code} applied
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                aria-label="Remove coupon"
                className="text-muted-foreground hover:text-danger"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="h-10 flex-1 rounded-button border border-border bg-surface-alt px-3 text-sm focus:border-primary focus:outline-none"
              />
              <Button type="submit" variant="outline" size="sm" disabled={isApplying}>
                Apply
              </Button>
            </form>
          )}
        </div>
      )}

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</dt>
          <dd className="font-medium text-foreground">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="font-medium text-success">-{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="font-medium text-foreground">
            {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd className="font-medium text-foreground">{formatPrice(totals.tax)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="font-heading text-base font-bold text-foreground">Total</span>
        <span className="font-heading text-xl font-extrabold text-foreground">{formatPrice(totals.total)}</span>
      </div>

      {children}

      {ctaHref ? (
        <Link href={ctaHref} aria-disabled={ctaDisabled} className="w-full">
          <Button variant="primary" size="lg" fullWidth disabled={ctaDisabled}>
            {ctaLabel}
          </Button>
        </Link>
      ) : (
        <Button variant="primary" size="lg" fullWidth onClick={onCtaClick} disabled={ctaDisabled}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
