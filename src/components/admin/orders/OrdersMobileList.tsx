// src/components/admin/orders/OrdersMobileList.tsx

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

interface OrdersMobileListProps {
  orders: AdminOrder[];
}

function OrdersMobileList({
  orders,
}: OrdersMobileListProps) {
  return (
    <div className="divide-y divide-[#EFE3D2] lg:hidden">

      {orders.map((order) => (
        <article
          key={order.id}
          className="p-5 transition-colors duration-200 hover:bg-[#FFFCF8] sm:p-6"
        >

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">
              <span className="inline-flex rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[12px] font-semibold text-[#A85F70]">
                {order.orderNumber}
              </span>

              <p className="mt-2 text-[11px] text-[#A0958C]">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>

            <p className="shrink-0 text-[15px] font-bold text-[#1F4A2E]">
              {formatAmount(
                order.totalAmount
              )}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-[#3D3834]">
              {order.customerName}
            </p>

            <p className="mt-1 text-[12px] text-[#8B7A6C]">
              {order.customerPhone}
            </p>

            {order.customerEmail && (
              <p className="mt-1 truncate text-[11px] text-[#A0958C]">
                {order.customerEmail}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <PaymentStatusBadge
              status={
                order.paymentStatus
              }
            />

            <OrderStatusBadge
              status={
                order.orderStatus
              }
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#F1E9E1] pt-4">

            <p className="text-[12px] text-[#8B7A6C]">
              {order.itemCount}{" "}
              {order.itemCount === 1
                ? "item"
                : "items"}
            </p>

            <button
              type="button"
              aria-label={`View ${order.orderNumber}`}
              title="View order"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#D7E2F8] bg-[#F2F6FF] px-3.5 text-[12px] font-semibold text-[#4D7FEA] transition-all duration-200 hover:border-[#BFD0F5] hover:bg-[#E8F0FF] hover:text-[#3D6ED8]"
            >
              <Eye
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              View
            </button>

          </div>
        </article>
      ))}
    </div>
  );
}

export default OrdersMobileList;