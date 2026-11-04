
import type {
  AdminOrder,
  OrderStatus,
  DeliveryStatus,
} from "./types";

import OrdersEmptyState from "./OrdersEmptyState";
import OrdersTable from "./OrdersTable";

interface OrdersListProps {
  orders: AdminOrder[];
  hasSearch: boolean;
  onClearSearch: () => void;

  onOrderStatusChange: (
    orderId: number,
    orderStatus: OrderStatus
  ) => Promise<void>;

  onDeliveryStatusChange: (
    orderId: number,
    deliveryStatus: DeliveryStatus
  ) => Promise<void>;
}

function OrdersList({
  orders,
  hasSearch,
  onClearSearch,
  onOrderStatusChange,
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
        onOrderStatusChange={onOrderStatusChange}
        onDeliveryStatusChange={onDeliveryStatusChange}
      />
    </div>
  );
}

export default OrdersList;
