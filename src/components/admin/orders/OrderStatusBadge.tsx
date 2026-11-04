
import type { OrderStatus } from "./types";

import {
  getOrderStatusClass,
} from "./orderUtils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",

  // Legacy statuses
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
};

function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.01em] ${getOrderStatusClass(
        status
      )}`}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default OrderStatusBadge;
