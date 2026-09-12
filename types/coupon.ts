export type CouponType = "percentage" | "fixed" | "free-shipping";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number;
  description: string;
}
