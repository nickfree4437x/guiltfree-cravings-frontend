// src/components/admin/orders/OrdersMobileList.tsx

import type { AdminOrder } from "./types";

import {
  formatAmount,
  formatDate,
} from "./orderUtils";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersMobileListProps {
  orders: AdminOrder[];
}

function OrdersMobileList({
  orders,
}: OrdersMobileListProps) {
  return (
    <div className="divide-y divide-[#eadfd3] lg:hidden">

      {orders.map((order) => (
        <article
          key={order.id}
          className="p-5 sm:p-6"
        >

          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-bold text-slate-900">
                {order.orderNumber}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>

            <p className="text-sm font-bold text-slate-900">
              {formatAmount(
                order.totalAmount
              )}
            </p>

          </div>

          {/* CUSTOMER */}

          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-800">
              {order.customerName}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {order.customerPhone}
            </p>
          </div>

          {/* STATUS */}

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="rounded-full">
              <PaymentStatusBadge
                status={
                  order.paymentStatus
                }
              />
            </span>

            <span className="rounded-full">
              <OrderStatusBadge
                status={
                  order.orderStatus
                }
              />
            </span>

          </div>

          {/* FOOTER */}

          <div className="mt-5 flex items-center justify-between">

            <p className="text-xs text-slate-500">
              {order.itemCount}{" "}
              {order.itemCount === 1
                ? "item"
                : "items"}
            </p>

            <button
              type="button"
              className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
            >
              View Order
            </button>

          </div>

        </article>
      ))}

    </div>
  );
}

export default OrdersMobileList;