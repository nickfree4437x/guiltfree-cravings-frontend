// src/components/admin/orders/OrdersList.tsx

import type {
  AdminOrder,
  DeliveryStatus,
} from "./types";

import OrdersEmptyState from "./OrdersEmptyState";
import OrdersTable from "./OrdersTable";

interface OrdersListProps {
  orders: AdminOrder[];
  hasSearch: boolean;
  onClearSearch: () => void;
  onDeliveryStatusChange: (
    orderId: number,
    deliveryStatus: DeliveryStatus
  ) => Promise<void>;
}

function OrdersList({
  orders,
  hasSearch,
  onClearSearch,
  onDeliveryStatusChange,
}: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <OrdersEmptyState
        hasSearch={hasSearch}
        onClearSearch={onClearSearch}
      />
    );
  }

  return (
    <div className="rounded-xl">
      <OrdersTable
        orders={orders}
        onDeliveryStatusChange={onDeliveryStatusChange}
      />
    </div>
  );
}

export default OrdersList;