// src/components/admin/orders/OrdersTable.tsx

import {
  Eye,
} from "lucide-react";

import type {
  AdminOrder,
} from "./types";

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
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Order
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Items
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Payment
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Status
            </th>

            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Date
            </th>

            <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
              Action
            </th>

          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#FFFCF8]"
            >

              {/* ORDER */}

              <td className="px-6 py-4">
                <span className="inline-flex rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[12px] font-semibold text-[#A85F70]">
                  {order.orderNumber}
                </span>
              </td>

              {/* CUSTOMER */}

              <td className="px-6 py-4">
                <p className="text-[13px] font-semibold text-[#3D3834]">
                  {order.customerName}
                </p>

                <p className="mt-1 text-[12px] text-[#9A8D82]">
                  {order.customerPhone}
                </p>
              </td>

              {/* ITEMS */}

              <td className="px-6 py-4">
                <span className="text-[13px] font-semibold text-[#5F554E]">
                  {order.itemCount}
                </span>

                <span className="ml-1 text-[12px] text-[#9A8D82]">
                  {order.itemCount === 1
                    ? "item"
                    : "items"}
                </span>
              </td>

              {/* AMOUNT */}

              <td className="px-6 py-4">
                <span className="text-[14px] font-semibold text-[#1F4A2E]">
                  {formatAmount(
                    order.totalAmount
                  )}
                </span>

                {order.discountAmount >
                  0 && (
                  <p className="mt-1 text-[11px] text-[#3F8A58]">
                    Discount applied
                  </p>
                )}
              </td>

              {/* PAYMENT */}

              <td className="px-6 py-4">
                <PaymentStatusBadge
                  status={
                    order.paymentStatus
                  }
                />
              </td>

              {/* STATUS */}

              <td className="px-6 py-4">
                <OrderStatusBadge
                  status={
                    order.orderStatus
                  }
                />
              </td>

              {/* DATE */}

              <td className="px-6 py-4">
                <span className="text-[12px] text-[#766A61]">
                  {formatDate(
                    order.createdAt
                  )}
                </span>
              </td>

              {/* ACTION */}

              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  aria-label={`View ${order.orderNumber}`}
                  title="View order"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA] transition-all duration-200 hover:border-[#BFD0F5] hover:bg-[#E8F0FF] hover:text-[#3D6ED8]"
                >
                  <Eye
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
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