import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaShippingFast,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";

import type { Order } from "../../api/orderApi";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemsList from "./OrderItemsList";

// ─── Types ────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
}

type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

interface DeliveryStatusConfig {
  label: string;
  description: string;
  className: string;
  icon: typeof FaClock;
}

// ─── Date Formatter ───────────────────────────────────────
function formatOrderDate(dateString?: string | null) {
  if (!dateString) return "Date unavailable";

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

// ─── Delivery Status Configuration ────────────────────────
const DELIVERY_STATUS_CONFIG: Record<
  DeliveryStatus,
  DeliveryStatusConfig
> = {
  PENDING: {
    label: "Pending",
    description: "Your delivery is awaiting confirmation.",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: FaClock,
  },

  CONFIRMED: {
    label: "Confirmed",
    description: "Your order is confirmed for delivery.",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: FaCheckCircle,
  },

  PROCESSING: {
    label: "Processing",
    description: "Your order is being prepared.",
    className: "border-purple-200 bg-purple-50 text-purple-700",
    icon: FaBox,
  },

  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    description: "Your order is on its way to you.",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: FaTruck,
  },

  DELIVERED: {
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: FaCheckCircle,
  },

  CANCELLED: {
    label: "Cancelled",
    description: "The delivery for this order was cancelled.",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: FaTimesCircle,
  },
};

// ─── Normalize Delivery Status ────────────────────────────
function normalizeDeliveryStatus(
  status?: string | null
): DeliveryStatus {
  const normalizedStatus = status?.toUpperCase();

  if (
    normalizedStatus &&
    normalizedStatus in DELIVERY_STATUS_CONFIG
  ) {
    return normalizedStatus as DeliveryStatus;
  }

  return "PENDING";
}

// ─── Delivery Status Card ─────────────────────────────────
function DeliveryStatusCard({ order }: OrderCardProps) {
  const deliveryStatus = normalizeDeliveryStatus(order.deliveryStatus);

  const config = DELIVERY_STATUS_CONFIG[deliveryStatus];
  const Icon = config.icon;

  const deliveredAt = order.deliveredAt;

  return (
    <section
      aria-label="Delivery information"
      className="rounded-xl border border-[#EFE3D2] bg-[#FFFBFC] p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${config.className}`}
        >
          <Icon className="text-base" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39890]">
                Delivery Status
              </p>

              <h3 className="mt-1 text-[14px] font-semibold text-[#3E3430] sm:text-[15px]">
                {config.label}
              </h3>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold sm:text-[11px] ${config.className}`}
            >
              {config.label}
            </span>
          </div>

          <p className="mt-2 text-[12px] leading-5 text-[#8B7A6C] sm:text-[13px]">
            {config.description}
          </p>

          {deliveryStatus === "DELIVERED" && deliveredAt && (
            <div className="mt-3 flex items-center gap-2 border-t border-[#EFE3D2] pt-3 text-[12px] text-emerald-700">
              <FaCheckCircle
                className="shrink-0"
                aria-hidden="true"
              />

              <span>
                Delivered on{" "}
                <strong className="font-semibold">
                  {formatOrderDate(deliveredAt)}
                </strong>
              </span>
            </div>
          )}

          {deliveryStatus === "OUT_FOR_DELIVERY" && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-[11px] font-medium text-sky-700 sm:text-[12px]">
              <FaShippingFast
                className="shrink-0"
                aria-hidden="true"
              />

              Your order is on its way!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Component ───────────────────────────────────────────
function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const summaryCells = [
    {
      label: "Items",
      value: `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`,
      isAmount: false,
    },
    {
      label: "Customer",
      value: order.customerName || "Customer",
      isAmount: false,
    },
    {
      label: "Total Amount",
      value: `₹${Number(order.totalAmount).toLocaleString("en-IN")}`,
      isAmount: true,
    },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm transition-all duration-300 hover:border-[#DDB0BB]">
      {/* ─── Order Header ──────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.10em] text-[#A39890]">
              Order Number
            </p>

            <h2 className="mt-1 break-all text-[17px] font-semibold tracking-tight text-[#3E3430] sm:text-[19px]">
              {order.orderNumber}
            </h2>

            <p className="mt-1 text-[11px] text-[#8B7A6C] sm:text-xs">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

      {/* ─── Order Summary ─────────────────────────────── */}
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
                } ${
                  isFirst
                    ? "sm:pr-4"
                    : isLast
                      ? "sm:pl-5"
                      : "sm:px-5"
                }`}
              >
                <p className="shrink-0 text-[10px] uppercase tracking-[0.10em] text-[#A39890]">
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

      {/* ─── Delivery Status ──────────────────────────── */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <DeliveryStatusCard order={order} />
      </div>

      {/* ─── Order Items ──────────────────────────────── */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <OrderItemsList items={order.items} />
      </div>

      {/* ─── Footer ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-[12px] text-[#8B7A6C] sm:text-[14px]">
          <FaMapMarkerAlt
            className="shrink-0 text-[#B5697A]"
            aria-hidden="true"
          />

          <span>
            Payment Status:{" "}
            <span className="font-medium capitalize text-[#5E5148]">
              {order.paymentStatus
                .toLowerCase()
                .replace(/_/g, " ")}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/orders/${order.id}`)}
          className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[#B5697A] px-6 text-[12px] font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#A55F70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A] focus-visible:ring-offset-2 sm:w-auto"
        >
          View Order
        </button>
      </div>
    </article>
  );
}

export default OrderCard;