import { useNavigate } from "react-router-dom";

import type { Order } from "../../api/orderApi";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemsList from "./OrderItemsList";

interface OrderCardProps {
  order: Order;
}

function formatOrderDate(
  dateString: string
) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function OrderCard({
  order,
}: OrderCardProps) {
  const navigate = useNavigate();

  const totalItems = order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <article
      className="
        overflow-hidden
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:border-[#E8C8D0]
      "
    >
      {/* =================================================
          ORDER HEADER
      ================================================= */}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#A39890] sm:text-[10px]">
              Order Number
            </p>

            <h2 className="mt-1.5 break-all text-[17px] font-semibold tracking-tight text-[#3E3430] sm:text-[19px]">
              {order.orderNumber}
            </h2>

            <p className="mt-1.5 text-[10px] text-[#8B7A6C] sm:text-[11px]">
              Placed on{" "}
              {formatOrderDate(
                order.createdAt
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge
              type="order"
              status={order.orderStatus}
            />

            <OrderStatusBadge
              type="payment"
              status={order.paymentStatus}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <div
        className="
          border-y
          border-[#EFE3D2]
          bg-[#FFFCF7]
          px-5
          py-4
          sm:px-6
        "
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Items */}

          <div className="sm:border-r sm:border-[#EFE3D2] sm:pr-4">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#A39890]">
              Items
            </p>

            <p className="mt-1 text-[12px] font-semibold text-[#5E5148] sm:text-[13px]">
              {totalItems}{" "}
              {totalItems === 1
                ? "Item"
                : "Items"}
            </p>
          </div>

          {/* Customer */}

          <div className="sm:border-r sm:border-[#EFE3D2] sm:px-4">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#A39890]">
              Customer
            </p>

            <p className="mt-1 truncate text-[12px] font-semibold text-[#5E5148] sm:text-[13px]">
              {order.customerName}
            </p>
          </div>

          {/* Total */}

          <div className="sm:pl-4">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#A39890]">
              Total
            </p>

            <p className="mt-1 text-[14px] font-semibold text-[#B5697A] sm:text-[15px]">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          ORDER ITEMS
      ================================================= */}

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#A39890]">
            Order Items
          </p>

          {order.items.length > 3 && (
            <span className="text-[10px] text-[#A39890]">
              {order.items.length} total
            </span>
          )}
        </div>

        <OrderItemsList
          items={order.items}
        />
      </div>

      {/* =================================================
          ORDER FOOTER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-t
          border-[#EFE3D2]
          px-5
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <p className="text-[10px] leading-5 text-[#A39890] sm:text-[11px]">
          Payment status:{" "}
          <span className="capitalize text-[#6F625A]">
            {order.paymentStatus
              .toLowerCase()
              .replace(/_/g, " ")}
          </span>
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/orders/${order.id}`
            )
          }
          className="
            inline-flex
            h-9
            items-center
            justify-center
            rounded-full
            bg-[#B5697A]
            px-5
            text-[11px]
            text-white
            transition-all
            duration-200
            hover:bg-[#A55F70]
            hover:shadow-sm
            active:scale-[0.98]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#B5697A]/30
            focus-visible:ring-offset-2
            sm:text-[12px]
          "
        >
          View Order
        </button>
      </div>
    </article>
  );
}

export default OrderCard;