import type { Coupon } from "@/types/coupon";

/** Mock coupon table — a real backend would validate these server-side. */
export const coupons: Coupon[] = [
  { code: "FARAZ10", type: "percentage", value: 10, description: "10% off your order" },
  { code: "WELCOME5", type: "fixed", value: 5, description: "$5 off your order" },
  { code: "FREESHIP", type: "free-shipping", value: 0, description: "Free shipping" },
];
