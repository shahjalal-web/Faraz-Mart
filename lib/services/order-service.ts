import { orders as seedOrders } from "@/data/orders";
import type { CartItem } from "@/types/cart";
import type { Coupon } from "@/types/coupon";
import type { DeliveryMethod, Order, PaymentMethod, ShippingAddress } from "@/types/order";
import { calculateOrderTotals } from "@/lib/pricing";

const STORAGE_KEY = "fajarmart-orders";

/**
 * Orders are user-generated at runtime (unlike the static product/category
 * catalog), so this service persists them to localStorage behind the same
 * async function signatures a real `/api/orders` endpoint would expose —
 * UI code never touches `localStorage` directly.
 */
function readStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeStoredOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export async function getOrders(): Promise<Order[]> {
  const stored = readStoredOrders();
  return [...stored, ...seedOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const all = await getOrders();
  return all.find((order) => order.id === orderId) ?? null;
}

interface CreateOrderInput {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  coupon: Coupon | null;
}

function generateOrderId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `FM-${suffix}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totals = calculateOrderTotals(subtotal, input.deliveryMethod, input.coupon);

  const order: Order = {
    id: generateOrderId(),
    items: input.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      thumbnail: item.thumbnail,
      categoryId: item.categoryId,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    })),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    shippingAddress: input.shippingAddress,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    couponCode: input.coupon?.code,
    ...totals,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const stored = readStoredOrders();
  writeStoredOrders([order, ...stored]);

  return order;
}
