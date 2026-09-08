// src/components/admin/orders/OrdersList.tsx

import type { AdminOrder } from "./types";

import OrdersEmptyState from "./OrdersEmptyState";
import OrdersMobileList from "./OrdersMobileList";
import OrdersTable from "./OrdersTable";

interface OrdersListProps {
  orders: AdminOrder[];
  hasSearch: boolean;
  onClearSearch: () => void;
}

function OrdersList({
  orders,
  hasSearch,
  onClearSearch,
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
    <>
      <OrdersTable
        orders={orders}
      />

      <OrdersMobileList
        orders={orders}
      />
    </>
  );
}

export default OrdersList;