import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaShippingFast,
  FaTimesCircle,
  FaTruck,
  FaTag,
  FaUndo,
} from "react-icons/fa";

import type { Order, OrderStatus } from "../../api/orderApi";

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

// ─── Order Tracking Configuration ─────────────────────────

const ORDER_TRACKING_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
  icon: typeof FaBox;
  colorClass: string; // Active state ke liye dynamic color
}[] = [
  {
    status: "NEW",
    label: "Order Placed",
    description: "We have received your order.",
    icon: FaBox,
    colorClass: "text-blue-500 border-blue-500",
  },
  {
    status: "CONFIRMED",
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: FaCheckCircle,
    colorClass: "text-purple-500 border-purple-500",
  },
  {
    status: "PACKED",
    label: "Order Packed",
    description: "Your order is packed and ready to ship.",
    icon: FaBox,
    colorClass: "text-amber-500 border-amber-500",
  },
  {
    status: "SHIPPED",
    label: "Order Shipped",
    description: "Your order is on its way.",
    icon: FaTruck,
    colorClass: "text-sky-500 border-sky-500",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: FaCheckCircle,
    colorClass: "text-emerald-500 border-emerald-500",
  },
];

const LEGACY_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
];

// ─── Currency Formatter ───────────────────────────────────

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    "en-IN",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;
}

// ─── Date Formatter ───────────────────────────────────────

function formatOrderDate(dateString?: string | null) {
  if (!dateString) return "Date unavailable";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
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
    description: "Your delivery is being processed.",
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
  if (normalizedStatus && normalizedStatus in DELIVERY_STATUS_CONFIG) {
    return normalizedStatus as DeliveryStatus;
  }
  return "PENDING";
}

// ─── Order Tracking Timeline (Simple & Clean) ─────────────

function OrderTrackingTimeline({ order }: OrderCardProps) {
  const currentStatus = order.orderStatus;

  const isCancelled = currentStatus === "CANCELLED";
  const isReturned = currentStatus === "RETURNED";
  const isLegacy = LEGACY_ORDER_STATUSES.includes(currentStatus);

  const currentStepIndex = ORDER_TRACKING_STEPS.findIndex(
    (step) => step.status === currentStatus
  );

  const isValidNewStatus = currentStepIndex !== -1;

  return (
    <section
      aria-label="Order tracking timeline"
      className="rounded-lg border border-[#EFE3D2] bg-white p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#F1E7DF] pb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-700">
            Order Tracking
          </h3>
          <p className="mt-0 text-[11px] text-slate-500">
            Follow your order journey
          </p>
        </div>
        <OrderStatusBadge type="order" status={currentStatus} />
      </div>

      {/* Cancelled */}
      {isCancelled && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FaTimesCircle />
          </div>
          <div>
            <h4 className="text-[12px] md:text-[13px] font-semibold text-red-700">
              Order Cancelled
            </h4>
            <p className="mt-0 text-[10px] md:text-[11px] leading-relaxed text-red-600">
              This order has been cancelled.
            </p>
          </div>
        </div>
      )}

      {/* Returned */}
      {isReturned && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <FaUndo />
          </div>
          <div>
            <h4 className="text-[12px] md:text-[13px] font-semibold text-rose-700">
              Order Returned
            </h4>
            <p className="mt-0 text-[10px] md:text-[11px] leading-relaxed text-rose-600">
              This order has been marked as returned.
            </p>
          </div>
        </div>
      )}

      {/* Legacy */}
      {isLegacy && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[12px] md:text-[13px] font-semibold text-amber-800">
            Legacy Order
          </p>
          <p className="mt-0 text-[10px] md:text-[11px] leading-relaxed text-amber-700">
            This order uses the previous order tracking system.
            Its original status is shown above.
          </p>
        </div>
      )}

      {/* Timeline (Clean Multi-Color Active) */}
      {isValidNewStatus && (
        <div className="mt-4">
          <div className="relative">
            {ORDER_TRACKING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              const Icon = step.icon;

              return (
                <div
                  key={step.status}
                  className="relative flex gap-3 pb-8 last:pb-0"
                >
                  {/* Connector */}
                  {index !== ORDER_TRACKING_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-[32px] h-[calc(100%-24px)] w-[2px] ${
                        isCompleted ? "bg-emerald-500" : "bg-[#EAE2DC]"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                      isCompleted
                        ? "border-emerald-500 text-emerald-500"
                        : isCurrent
                          ? step.colorClass // <-- ACTIVE COLOR CHANGE
                          : "border-[#E7DED7] text-[#B5AAA1]"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle className="text-[14px]" />
                    ) : (
                      <Icon className="text-[12px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1">
                    <h4
                      className={`text-[13px] font-semibold ${
                        isUpcoming
                          ? "text-slate-500"
                          : isCurrent
                            ? "text-gray-600"
                            : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p
                      className={`mt-0 text-[11px] leading-relaxed ${
                        isUpcoming
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {step.description}
                    </p>

                    {step.status === "NEW" && (
                      <p className="mt-1 text-[10px] text-slate-500">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    )}

                    {step.status === "DELIVERED" &&
                      isCurrent &&
                      order.deliveredAt && (
                        <p className="mt-1 text-[10px] text-emerald-700">
                          Delivered on{" "}
                          {formatOrderDate(order.deliveredAt)}
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isValidNewStatus && !isLegacy && !isCancelled && !isReturned && (
        <p className="mt-4 text-[12px] text-slate-500">
          Order tracking information is currently unavailable.
        </p>
      )}
    </section>
  );
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
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.10em] text-slate-500">
                Delivery Status
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-600 sm:text-[16px]">
                {config.label}
              </h3>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] sm:text-[11px] ${config.className}`}
            >
              {config.label}
            </span>
          </div>

          <p className="mt-0 text-[11px] leading-relaxed text-slate-500 sm:text-[12px]">
            {config.description}
          </p>

          {deliveryStatus === "DELIVERED" && deliveredAt && (
            <div className="mt-3 flex items-center gap-2 border-t border-[#EFE3D2] pt-3 text-[12px] text-emerald-700">
              <FaCheckCircle className="shrink-0" aria-hidden="true" />
              <span>
                Delivered on{" "}
                <strong className="font-semibold">
                  {formatOrderDate(deliveredAt)}
                </strong>
              </span>
            </div>
          )}

          {deliveryStatus === "OUT_FOR_DELIVERY" && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-[11px] text-sky-700 sm:text-[12px]">
              <FaShippingFast className="shrink-0" aria-hidden="true" />
              Your order is on its way!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Order Price Summary ──────────────────────────────────

function OrderPriceSummary({ order }: OrderCardProps) {
  const subtotal = Number(order.subtotal) || 0;
  const discountAmount = Math.max(0, Number(order.discountAmount) || 0);
  const totalAmount = Number(order.totalAmount) || 0;
  const hasDiscount = discountAmount > 0;
  const savings = Math.min(discountAmount, subtotal);

  return (
    <section
      aria-label="Order price summary"
      className="rounded-xl border border-[#EFE3D2] bg-white p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 border-b border-[#F1E7DF] pb-3">
        <FaTag className="text-[#B5697A]" />
        <h3 className="text-[13px] font-semibold text-[#3E3430] sm:text-[14px]">
          Price Summary
        </h3>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] text-[#8B7A6C] sm:text-[13px]">
            Subtotal
          </span>
          <span className="text-[13px] font-medium text-[#5E5148]">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {hasDiscount && (
          <>
            {order.offerCode && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] text-[#8B7A6C] sm:text-[13px]">
                  Applied Offer
                </span>
                <span className="rounded-md bg-[#FDF1F4] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#B5697A]">
                  {order.offerCode}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#8B7A6C] sm:text-[13px]">
                Offer / Coupon Discount
              </span>
              <span className="text-[13px] font-semibold text-emerald-600">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          </>
        )}

        {Number(order.deliveryCharge) > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-[#8B7A6C] sm:text-[13px]">
              Delivery Charge
            </span>
            <span className="text-[13px] font-medium text-[#5E5148]">
              {formatCurrency(order.deliveryCharge)}
            </span>
          </div>
        )}

        <div className="border-t border-[#F1E7DF] pt-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-semibold text-[#3E3430]">
              Total Amount
            </span>
            <span className="text-[18px] font-semibold text-[#B5697A] sm:text-[20px]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {hasDiscount && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2.5">
            <span className="text-[11px] text-emerald-700 sm:text-[12px]">
              You saved on this order!
            </span>
            <span className="text-[13px] font-bold text-emerald-700">
              {formatCurrency(savings)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────

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
      value: formatCurrency(order.totalAmount),
      isAmount: true,
    },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm transition-all duration-300 hover:border-[#DDB0BB]">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.10em] text-slate-500">
              Order Number
            </p>
            <h2 className="mt-1 break-all text-[17px] font-semibold tracking-tight text-[#3E3430] sm:text-[19px]">
              {order.orderNumber}
            </h2>
            <p className="mt-0 text-[11px] text-slate-500 sm:text-xs">
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
                <p className="shrink-0 text-[10px] uppercase tracking-[0.10em] text-slate-500">
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

      {/* Timeline */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <OrderTrackingTimeline order={order} />
      </div>

      {/* Delivery Status */}
      <div className="px-5 pt-5 sm:px-6">
        <DeliveryStatusCard order={order} />
      </div>

      {/* Items */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <OrderItemsList items={order.items} />
      </div>

      {/* Price Summary */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <OrderPriceSummary order={order} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-500 sm:text-[14px]">
          <FaMapMarkerAlt className="shrink-0 text-[#B5697A]" aria-hidden="true" />
          <span>
            Payment Status:{" "}
            <span className="font-medium capitalize text-[#5E5148]">
              {order.paymentStatus.toLowerCase().replace(/_/g, " ")}
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