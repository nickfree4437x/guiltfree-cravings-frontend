import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ReceiptText,
  UserRound,
  CreditCard,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock3,
  PackageCheck,
  MapPin,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { getOrderById } from "../../api/orderApi";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from "../../api/orderApi";

// ─── Types ────────────────────────────────────────────────
interface OrderDetailsLocationState {
  order?: Order;
}

interface DeliveryStatusConfig {
  label: string;
  description: string;
  icon: typeof Package;
  className: string;
  iconClassName: string;
}

// ─── Helpers ──────────────────────────────────────────────
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status?: string | null) {
  if (!status) return "Not available";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatCurrency(amount: number | string | null | undefined) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

// HTTP status → user-friendly message
function getOrderErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err
  ) {
    const status = (
      err as { response?: { status?: number } }
    ).response?.status;

    if (status === 401) {
      return "Please sign in again to view your order.";
    }

    if (status === 403) {
      return "You are not authorized to view this order.";
    }

    if (status === 404) {
      return "This order could not be found.";
    }

    return "We couldn't load your order. Please try again.";
  }

  return "We couldn't connect to the server. Please check your connection and try again.";
}

// ─── Delivery Status Configuration ────────────────────────
const DELIVERY_STATUS_CONFIG: Record<
  DeliveryStatus,
  DeliveryStatusConfig
> = {
  PENDING: {
    label: "Pending",
    description: "Your delivery is awaiting confirmation.",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
    iconClassName: "bg-amber-100 text-amber-700",
  },

  CONFIRMED: {
    label: "Confirmed",
    description: "Your order is confirmed and awaiting preparation.",
    icon: CheckCircle2,
    className: "border-blue-200 bg-blue-50 text-blue-700",
    iconClassName: "bg-blue-100 text-blue-700",
  },

  PROCESSING: {
    label: "Processing",
    description: "Your order is being prepared.",
    icon: Package,
    className: "border-purple-200 bg-purple-50 text-purple-700",
    iconClassName: "bg-purple-100 text-purple-700",
  },

  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    description: "Your order is on its way to your delivery address.",
    icon: Truck,
    className: "border-sky-200 bg-sky-50 text-sky-700",
    iconClassName: "bg-sky-100 text-sky-700",
  },

  DELIVERED: {
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: PackageCheck,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    iconClassName: "bg-emerald-100 text-emerald-700",
  },

  CANCELLED: {
    label: "Cancelled",
    description: "The delivery for this order was cancelled.",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
    iconClassName: "bg-red-100 text-red-700",
  },
};

function normalizeDeliveryStatus(
  status?: string | null
): DeliveryStatus {
  if (
    status &&
    Object.prototype.hasOwnProperty.call(
      DELIVERY_STATUS_CONFIG,
      status
    )
  ) {
    return status as DeliveryStatus;
  }

  return "PENDING";
}

// ─── Order / Payment Status Badge ─────────────────────────
function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: OrderStatus | PaymentStatus;
}) {
  const normalized = status.toLowerCase();

  const isSuccess = [
    "paid",
    "completed",
    "confirmed",
  ].includes(normalized);

  const isFailed = [
    "failed",
    "cancelled",
    "refunded",
  ].includes(normalized);

  const styles = isSuccess
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : isFailed
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-light uppercase tracking-wider text-[#A39890]">
        {label}
      </span>

      <span
        className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-[10px] capitalize ${styles}`}
      >
        {formatStatus(status)}
      </span>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────
function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
        {icon}
      </div>

      <div>
        <h2 className="text-[16px] font-semibold text-slate-700 md:text-[18px]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Delivery Status Card ─────────────────────────────────
function DeliveryStatusCard({ order }: { order: Order }) {
  const status = normalizeDeliveryStatus(order.deliveryStatus);
  const config = DELIVERY_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <section
      aria-label="Delivery tracking information"
      className="overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm"
    >
      <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-7">
        <SectionHeader
          icon={<Truck className="h-5 w-5" />}
          title="Delivery Tracking"
          subtitle="Check the latest status of your order"
        />
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config.iconClassName}`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39890]">
              Current Delivery Status
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
              >
                {config.label}
              </span>
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-500 sm:text-sm">
              {config.description}
            </p>
          </div>
        </div>

        {status === "OUT_FOR_DELIVERY" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />

            <div>
              <p className="text-sm font-semibold text-sky-800">
                Your order is on its way!
              </p>

              <p className="mt-1 text-xs leading-5 text-sky-700">
                Your order has been marked as out for delivery. Please keep your phone available.
              </p>
            </div>
          </div>
        )}

        {status === "DELIVERED" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Order delivered successfully!
              </p>

              {order.deliveredAt ? (
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Delivered on {formatOrderDate(order.deliveredAt)}
                </p>
              ) : (
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Your order has been marked as delivered.
                </p>
              )}
            </div>
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Delivery cancelled
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                Please contact our support team if you need help with this order.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Component ────────────────────────────────────────────
function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState =
    location.state as OrderDetailsLocationState | null;

  const [order, setOrder] = useState<Order | null>(
    locationState?.order?.id === Number(orderId)
      ? locationState.order
      : null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Load Order ─────────────────────────────────────────
  useEffect(() => {
    let isActive = true;

    const loadOrder = async () => {
      const id = Number(orderId);

      if (
        !orderId ||
        !Number.isSafeInteger(id) ||
        id <= 0
      ) {
        setOrder(null);
        setError("The order ID is invalid.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getOrderById(id);

        if (!isActive) return;

        if (data.id !== id) {
          setOrder(null);
          setError("The requested order could not be verified.");
          return;
        }

        setOrder(data);
      } catch (err) {
        if (!isActive) return;

        setOrder(null);
        setError(getOrderErrorMessage(err));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      isActive = false;
    };
  }, [orderId]);

  // ─── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5 py-16">
        <div
          className="text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#B5697A]">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Loading Order Details
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we retrieve your order.
          </p>
        </div>
      </main>
    );
  }

  // ─── Error ──────────────────────────────────────────────
  if (error || !order) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5 py-36">
        <section className="w-full max-w-md rounded-2xl border border-[#eadfd3] bg-white p-7 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#B5697A]">
            <ReceiptText className="h-7 w-7" />
          </div>

          <h1 className="mt-3 text-[18px] font-semibold text-slate-700 md:text-[22px]">
            Order Details Unavailable
          </h1>

          <p className="mt-2 text-[12px] leading-relaxed text-slate-600 md:text-[13px]">
            {error || "We couldn't find this order."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B5697A] px-6 py-2.5 text-xs text-white transition hover:bg-[#A55F70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
            >
              <ArrowLeft className="h-4 w-4" />
              My Orders
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfd3] bg-white px-6 py-2.5 text-xs font-semibold text-[#8b542f] transition hover:bg-[#fff8f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ─── Main ───────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white px-4 py-28 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Order Header */}
        <section className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#fff1f2] via-[#fff8f7] to-[#fffaf5] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white/80 px-3 py-1 text-[9px] uppercase tracking-wider text-[#9f6674] md:text-[10px]">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Order Details
                </span>

                <p className="mt-3 break-all text-xs text-[#B5697A] md:text-sm">
                  {order.orderNumber}
                </p>

                <p className="mt-1 text-[10px] text-slate-500 md:text-[12px]">
                  Placed on {formatOrderDate(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-5">
                <StatusBadge
                  label="Order Status"
                  status={order.orderStatus}
                />

                <StatusBadge
                  label="Payment Status"
                  status={order.paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-3 border-t border-[#eadfd3]">
            <div className="min-w-0 border-r border-[#eadfd3] p-3 sm:p-6">
              <p className="text-[9px] uppercase tracking-wider text-[#A39890] sm:text-[10px]">
                Total Items
              </p>

              <p className="mt-1 break-words text-[13px] font-semibold text-slate-700 sm:text-[16px]">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </p>
            </div>

            <div className="min-w-0 border-r border-[#eadfd3] p-3 sm:p-6">
              <p className="text-[9px] uppercase tracking-wider text-[#A39890] sm:text-[10px]">
                Customer
              </p>

              <p className="mt-1 break-words text-[13px] font-semibold text-slate-700 sm:text-[16px]">
                {order.customerName || "Not provided"}
              </p>
            </div>

            <div className="min-w-0 p-3 sm:p-6">
              <p className="text-[9px] uppercase tracking-wider text-[#A39890] sm:text-[10px]">
                Total Amount
              </p>

              <p className="mt-1 break-words text-[13px] font-semibold text-[#B5697A] sm:text-[16px]">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Tracking */}
        <div className="mt-6">
          <DeliveryStatusCard order={order} />
        </div>

        {/* Order Items */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
          <div className="border-b border-[#eadfd3] bg-white px-6 py-5 sm:px-8">
            <SectionHeader
              icon={<Package className="h-5 w-5" />}
              title="Items in Your Order"
              subtitle="Product, variant and quantity details"
            />
          </div>

          <div className="divide-y divide-[#f0e7df] px-6 sm:px-8">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-5"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-[12px] text-slate-700 sm:text-[14px]">
                    {item.productName}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="text-[#8b542f]">
                      {item.variantQuantity}
                      {item.variantUnit}
                    </span>

                    <span className="text-[#d8c8bb]">•</span>

                    <span className="capitalize">
                      {formatStatus(item.packaging)}
                    </span>

                    <span className="text-[#d8c8bb]">•</span>

                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>

                <p className="shrink-0 pt-0.5 text-[12px] tabular-nums text-slate-700 sm:text-[14px]">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={<CreditCard className="h-5 w-5" />}
            title="Price Summary"
          />

          <div className="mt-4 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
            <span className="text-slate-500">Subtotal</span>
            <span className="tabular-nums text-slate-700">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          {(order.discountAmount ?? 0) > 0 && (
            <div className="mt-2 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
              <span className="text-slate-500">
                Discount
                {order.offerCode ? ` (${order.offerCode})` : ""}
              </span>

              <span className="font-semibold tabular-nums text-emerald-700">
                −{formatCurrency(order.discountAmount)}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
            <span className="text-slate-500">Delivery Charge</span>

            <span className="tabular-nums text-slate-700">
              {Number(order.deliveryCharge) === 0
                ? "Free"
                : formatCurrency(order.deliveryCharge)}
            </span>
          </div>

          <div className="my-4 border-t border-dashed border-[#eadfd3]" />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#fff8f7] p-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-700 md:text-[14px]">
                Total Amount
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Final amount recorded for this order
              </p>
            </div>

            <p className="shrink-0 text-[12px] font-semibold tabular-nums text-[#8b542f] md:text-[14px]">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </section>

        {/* Customer Information */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            icon={<UserRound className="h-5 w-5" />}
            title="Customer Information"
            subtitle="Details associated with this order"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#eadfd3] bg-white p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
                Name
              </p>

              <p className="mt-1 break-words text-xs text-slate-700 md:text-sm">
                {order.customerName || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-[#eadfd3] bg-white p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
                Mobile Number
              </p>

              <p className="mt-1 break-words text-xs text-slate-700 md:text-sm">
                {order.customerPhone
                  ? `+91 ${order.customerPhone}`
                  : "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-[#eadfd3] bg-white p-4 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
                Email Address
              </p>

              <p className="mt-1 break-all text-sm text-slate-700">
                {order.customerEmail || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          <SectionHeader
            icon={<MapPin className="h-5 w-5" />}
            title="Delivery Address"
            subtitle="Your order's delivery destination"
          />

          {order.addressLine1 ? (
            <div className="mt-5 rounded-xl border border-[#eadfd3] bg-[#fffbfc] p-4 text-[12px] leading-6 text-slate-600 md:text-sm">
              <p>{order.addressLine1}</p>

              {order.addressLine2 && (
                <p>{order.addressLine2}</p>
              )}

              <p>
                {[order.area, order.city, order.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {order.pincode && (
                <p>PIN: {order.pincode}</p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Delivery address is not available for this order.
            </p>
          )}

          {order.deliveryZone && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#fffbfc] p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#B5697A]" />

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Delivery Zone
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {order.deliveryZone === "WITHIN_DWARKA"
                    ? "Within Dwarka"
                    : "Outside Dwarka"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Order Status Information */}
        <section className="mt-5 flex items-start gap-3 rounded-xl border border-[#eadfd3] bg-white p-5 md:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700">
              Order Status Information
            </h2>

            <p className="mt-2 text-[10px] leading-relaxed text-slate-500 md:text-[12px]">
              Your order is currently{" "}
              <span className="font-medium text-slate-700">
                {formatStatus(order.orderStatus)}
              </span>
              , and your payment status is{" "}
              <span className="font-medium text-slate-700">
                {formatStatus(order.paymentStatus)}
              </span>
              . Delivery progress is shown separately in the Delivery Tracking section above.
            </p>
          </div>
        </section>

        {/* Back to Orders */}
        <div className="mt-6 flex justify-center pb-4">
          <Link
            to="/orders"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#eadfd3] bg-white px-6 py-3 text-[10px] text-[#B5697A] transition hover:border-[#B5697A] hover:bg-[#fff8f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A] sm:w-auto sm:text-[12px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailsPage;