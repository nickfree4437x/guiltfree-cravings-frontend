// src/components/admin/orders/OrderStatusBadge.tsx

import type {
  OrderStatus,
} from "./types";

import {
  getOrderStatusClass,
} from "./orderUtils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] tracking-[0.01em] ${getOrderStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;