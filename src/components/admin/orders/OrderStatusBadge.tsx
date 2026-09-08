// src/components/admin/orders/OrderStatusBadge.tsx

import type { OrderStatus } from "./types";
import { getOrderStatusClass } from "./orderUtils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs ${getOrderStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;