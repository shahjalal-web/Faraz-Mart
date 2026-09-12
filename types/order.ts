export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "card" | "cod" | "mobile-banking";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  categoryId: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/** Linear progression a "forward" order follows; cancelled/returned/refunded branch off separately. */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};
