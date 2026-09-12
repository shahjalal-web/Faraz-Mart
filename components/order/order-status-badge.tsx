import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";

const STATUS_VARIANT: Record<OrderStatus, "success" | "warning" | "danger" | "primary" | "neutral" | "dark"> = {
  pending: "neutral",
  confirmed: "primary",
  processing: "warning",
  packed: "primary",
  shipped: "primary",
  "out-for-delivery": "primary",
  delivered: "success",
  cancelled: "danger",
  returned: "danger",
  refunded: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
