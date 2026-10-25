import { useNavigate } from "react-router-dom";

import type { Order } from "../../api/orderApi";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemsList from "./OrderItemsList";

// ─── Types ────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
}

// ─── Date Formatter ───────────────────────────────────────
function formatOrderDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ─── Component ────────────────────────────────────────────
function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);

  // Summary cells config (label + value)
  const summaryCells = [
    {
      label: "Items",
      value: `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`,
      isAmount: false,
    },
    {
      label: "Customer",
      value: order.customerName,
      isAmount: false,
    },
    {
      label: "Total Amount",
      value: `₹${order.totalAmount}`,
      isAmount: true,
    },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm transition-all duration-300 hover:border-[#DDB0BB]">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39890]">
              Order Number
            </p>
            <h2 className="mt-1.5 break-all text-[17px] font-semibold tracking-tight text-[#3E3430] sm:text-[19px]">
              {order.orderNumber}
            </h2>
            <p className="mt-1.5 text-[11px] text-[#8B7A6C] sm:text-xs">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge type="order" status={order.orderStatus} />
            <OrderStatusBadge type="payment" status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-y border-[#EFE3D2] bg-white px-5 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
          {summaryCells.map((cell, index) => {
            const isFirst = index === 0;
            const isLast = index === summaryCells.length - 1;
            return (
              <div
                key={cell.label}
                className={`flex items-center justify-between gap-4 sm:block ${
                  !isLast ? "sm:border-r sm:border-[#EFE3D2]" : ""
                } ${isFirst ? "sm:pr-4" : isLast ? "sm:pl-5" : "sm:px-5"}`}
              >
                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A39890]">
                  {cell.label}
                </p>
                <p
                  className={`min-w-0 text-right sm:mt-1.5 sm:text-left ${
                    cell.isAmount
                      ? "text-[14px] font-semibold text-[#B5697A] sm:text-[15px]"
                      : "truncate text-[12px] font-semibold text-[#5E5148] sm:text-[13px]"
                  }`}
                >
                  {cell.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <OrderItemsList items={order.items} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[12px] text-[#8B7A6C] sm:text-[14px]">
          Payment status:{" "}
          <span className="capitalize text-[#5E5148]">
            {order.paymentStatus.toLowerCase().replace(/_/g, " ")}
          </span>
        </p>

        <button
          type="button"
          onClick={() => navigate(`/orders/${order.id}`)}
          className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[#B5697A] px-6 font-[350] text-[12px] tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#A55F70] focus:outline-none focus-visible:ring-offset-2 sm:w-auto"
        >
          View Order
        </button>
      </div>
    </article>
  );
}

export default OrderCard;