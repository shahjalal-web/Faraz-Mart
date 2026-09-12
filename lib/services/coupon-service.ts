import { coupons } from "@/data/coupons";
import type { Coupon } from "@/types/coupon";

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  return coupons.find((coupon) => coupon.code === normalized) ?? null;
}
