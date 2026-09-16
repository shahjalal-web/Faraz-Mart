import type { CartItem } from "@/types/cart";
import type { Coupon } from "@/types/coupon";
import type { DeliveryMethod, Order, PaymentMethod, ShippingAddress } from "@/types/order";
import { fetchJson } from "@/lib/services/backend-client";

const MY_ORDER_IDS_KEY = "farazmart-my-order-ids";

/**
 * There's no customer login yet, so "my orders" can't be scoped by account
 * on the server — instead this browser remembers the ids of orders it has
 * placed (mirroring how the old localStorage-backed mock behaved in
 * practice: every visitor only ever saw their own browser's orders). This
 * is what keeps GET /api/orders/:id — a single, hard-to-guess order id — as
 * the only unauthenticated read on the Order collection; there's no bulk
 * "list every order" endpoint a stranger could hit.
 */
function readMyOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MY_ORDER_IDS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function rememberMyOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  const ids = readMyOrderIds();
  window.localStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify([orderId, ...ids]));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    return await fetchJson<Order>(`/api/orders/${orderId}`);
  } catch {
    return null;
  }
}

/** Customer-facing "My Orders" — see the comment on readMyOrderIds() above. */
export async function getMyOrders(): Promise<Order[]> {
  const ids = readMyOrderIds();
  const orders = await Promise.all(ids.map((id) => getOrderById(id)));
  return orders.filter((order): order is Order => order !== null);
}

/** Admin-only full order list — protected by requireAdmin() on the backend. */
export async function getOrders(): Promise<Order[]> {
  return fetchJson<Order[]>("/api/orders", { credentials: "include" });
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
  return fetchJson<Order>(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ status }),
  });
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

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order = await fetchJson<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      items: input.items,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      shippingAddress: input.shippingAddress,
      deliveryMethod: input.deliveryMethod,
      paymentMethod: input.paymentMethod,
      coupon: input.coupon,
    }),
  });

  rememberMyOrderId(order.id);
  return order;
}
