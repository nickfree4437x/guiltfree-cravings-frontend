// src/components/admin/orders/OrdersTable.tsx

import type { AdminOrder } from "./types";

import {
  formatAmount,
  formatDate,
} from "./orderUtils";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersTableProps {
  orders: AdminOrder[];
}

function OrdersTable({
  orders,
}: OrdersTableProps) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[1050px]">

        <thead>
          <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Order
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Items
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Status
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              Date
            </th>

            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
              Action
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-[#eadfd3]">

          {orders.map((order) => (
            <tr
              key={order.id}
              className="transition hover:bg-[#fffaf5]"
            >

              {/* ORDER */}

              <td className="px-6 py-5">
                <p className="text-sm font-bold text-slate-900">
                  {order.orderNumber}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  #{order.id}
                </p>
              </td>

              {/* CUSTOMER */}

              <td className="px-6 py-5">
                <p className="text-sm font-semibold text-slate-800">
                  {order.customerName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {order.customerPhone}
                </p>
              </td>

              {/* ITEMS */}

              <td className="px-6 py-5 text-sm text-slate-600">
                {order.itemCount}{" "}
                {order.itemCount === 1
                  ? "item"
                  : "items"}
              </td>

              {/* AMOUNT */}

              <td className="px-6 py-5 text-sm font-bold text-slate-900">
                {formatAmount(
                  order.totalAmount
                )}
              </td>

              {/* PAYMENT */}

              <td className="px-6 py-5">
                <PaymentStatusBadge
                  status={
                    order.paymentStatus
                  }
                />
              </td>

              {/* STATUS */}

              <td className="px-6 py-5">
                <OrderStatusBadge
                  status={
                    order.orderStatus
                  }
                />
              </td>

              {/* DATE */}

              <td className="px-6 py-5 text-sm text-slate-600">
                {formatDate(
                  order.createdAt
                )}
              </td>

              {/* ACTION */}

              <td className="px-6 py-5 text-right">
                <button
                  type="button"
                  className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
                >
                  View
                </button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;