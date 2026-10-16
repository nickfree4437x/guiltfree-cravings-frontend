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
} from "lucide-react";

import {
  getOrderById,
} from "../../api/orderApi";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../api/orderApi";

interface OrderDetailsLocationState {
  order?: Order;
}

function formatOrderDate(dateString: string) {
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

function formatStatus(status: string) {
  return status.toLowerCase().replace(/_/g, " ");
}

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
    "delivered",
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
      <span className="text-[10px] md:text-[11px] font-light uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <span
        className={`inline-flex w-fit text-[9px] md:text-[10px] items-center rounded-full border px-3 py-1.5 text-xs capitalize ${styles}`}
      >
        {formatStatus(status)}
      </span>
    </div>
  );
}

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

        // Prevent displaying a different order by mistake.
        if (data.id !== id) {
          setOrder(null);
          setError("The requested order could not be verified.");
          return;
        }

        setOrder(data);
      } catch (err) {
        if (!isActive) return;

        setOrder(null);

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err
        ) {
          const response = (
            err as {
              response?: {
                status?: number;
              };
            }
          ).response;

          if (response?.status === 401) {
            setError(
              "Please sign in again to view your order."
            );
          } else if (response?.status === 403) {
            setError(
              "You are not authorized to view this order."
            );
          } else if (response?.status === 404) {
            setError(
              "This order could not be found."
            );
          } else {
            setError(
              "We couldn't load your order. Please try again."
            );
          }
        } else {
          setError(
            "We couldn't connect to the server. Please check your connection and try again."
          );
        }
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

  if (error || !order) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5 py-12">
        <section className="w-full max-w-md rounded-3xl border border-[#eadfd3] bg-white p-7 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#B5697A]">
            <ReceiptText className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Order Details Unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error || "We couldn't find this order."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B5697A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A55F70] focus:outline-none focus:ring-2 focus:ring-[#B5697A] focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              My Orders
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfd3] bg-white px-6 py-3 text-sm font-semibold text-[#8b542f] transition hover:bg-[#fff8f7] focus:outline-none focus:ring-2 focus:ring-[#B5697A] focus:ring-offset-2"
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

  return (
    <main className="min-h-screen bg-white px-4 py-28 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Order Header */}
        <section className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#fff1f2] via-[#fff8f7] to-[#fffaf5] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white/80 px-3 py-1 text-[9px] md:text-[10px] uppercase tracking-wider text-[#9f6674]">
                  Order Details
                </span>

                <h1 className="mt-2 text-[14px] font-semibold tracking-tight text-slate-700 sm:text-[16px]">
                  Your Order
                </h1>

                <p className="mt-2 break-all text-xs md:text-sm text-[#B5697A]">
                  {order.orderNumber}
                </p>

                <p className="mt-1 text-[10px] md:text-[12px] text-slate-500">
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
          <div className="grid gap-4 border-t border-[#eadfd3] p-6 sm:grid-cols-3 sm:gap-0 sm:p-0">
            <div className="sm:border-r sm:border-[#eadfd3] sm:p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total Items
              </p>
              <p className="mt-1 text-[14px] md:text-[16px] font-semibold text-slate-700">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </p>
            </div>

            <div className="sm:border-r sm:border-[#eadfd3] sm:p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Customer
              </p>
              <p className="mt-1 text-[14px] md:text-[16px] font-semibold text-slate-700">
                {order.customerName || "Not provided"}
              </p>
            </div>

            <div className="sm:p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total Amount
              </p>
              <p className="mt-1 text-[14px] md:text-[16px] font-semibold text-[#B5697A]">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#eadfd3] bg-white px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-[16px] md:text-[18px] font-semibold text-slate-700">
                Items in Your Order
              </h2>
              <p className="mt-0 text-xs text-slate-500">
                Product, variant and quantity details
              </p>
            </div>
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
                    <span className=" text-[#8b542f]">
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
                  ₹{item.subtotal}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
              <CreditCard className="h-5 w-5" />
            </div>

            <h2 className="text-[16px] md:text-[18px] font-semibold text-slate-700">
              Price Summary
            </h2>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
            <span className="text-slate-500">Subtotal</span>
            <span className="tabular-nums text-slate-700">
              ₹{order.subtotal}
            </span>
          </div>

          {(order.discountAmount ?? 0) > 0 && (
            <div className="mt-2 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
              <span className="text-slate-500">
                Discount
                {order.offerCode ? ` (${order.offerCode})` : ""}
              </span>
              <span className="font-semibold tabular-nums text-emerald-700">
                −₹{order.discountAmount}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-4 text-[11px] md:text-[13px]">
            <span className="text-slate-500">Delivery Charge</span>
            <span className="tabular-nums text-slate-700">
              {order.deliveryCharge === 0
                ? "Free"
                : `₹${order.deliveryCharge}`}
            </span>
          </div>

          <div className="my-4 border-t border-dashed border-[#eadfd3]" />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#fff8f7] p-4">
            <div>
              <p className="font-semibold text-[12px] md:text-[14px] text-slate-700">
                Total Amount
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Final amount recorded for this order
              </p>
            </div>

            <p className="shrink-0 text-[12px] md:text-[14px] font-semibold tabular-nums text-[#8b542f]">
              ₹{order.totalAmount}
            </p>
          </div>
        </section>

        {/* Customer Information */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-[16px] md:text-[18px] font-semibold text-slate-700">
                Customer Information
              </h2>
              <p className="mt-0 text-xs text-slate-500">
                Details associated with this order
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#eadfd3] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <p className="text-xs uppercase tracking-wider">
                  Name
                </p>
              </div>
              <p className="mt-1 break-words text-xs md:text-sm text-slate-700">
                {order.customerName || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-[#eadfd3] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <p className="text-xs uppercase tracking-wider">
                  Mobile Number
                </p>
              </div>
              <p className="mt-1 break-words text-xs md:text-sm text-slate-700">
                {order.customerPhone
                  ? `+91 ${order.customerPhone}`
                  : "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-[#eadfd3] bg-white p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-slate-400">
                <p className="text-xs uppercase tracking-wider">
                  Email Address
                </p>
              </div>
              <p className="mt-1 break-all text-sm text-slate-700">
                {order.customerEmail || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        <section className="mt-5 rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-[14px] md:text-[16px] font-semibold text-slate-700">
            Delivery Address
          </h2>

          {order.addressLine1 ? (
            <div className="mt-1 text-[10px] md:text-[12px] font-[350] leading-relaxed text-slate-600">
              <p>{order.addressLine1}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              <p>
                {[order.area, order.city, order.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {order.pincode && <p>PIN: {order.pincode}</p>}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Delivery address is not available for this order.
            </p>
          )}

          <div className="mt-4 border-t border-[#f0e7df] pt-3">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Delivery Status
            </p>
            <p className="mt-1 text-xs md:text-sm capitalize text-slate-700">
              {formatStatus(order.deliveryStatus)}
            </p>
          </div>
        </section>

        {/* Status Information */}
        <section className="mt-5 flex items-start gap-3 rounded-xl border border-[#eadfd3] bg-white p-5 md:p-6">

          <div>
            <h2 className="text-sm font-semibold text-slate-700">
              Order Status Information
            </h2>
            <p className="mt-1 text-[10px] md:text-[12px] leading-relaxed text-slate-500">
              Your order is currently{" "}
              <span className="capitalize text-slate-700">
                {formatStatus(order.orderStatus)}
              </span>
              , and payment is{" "}
              <span className="capitalize text-slate-700">
                {formatStatus(order.paymentStatus)}
              </span>
              . These statuses reflect the information recorded for
              this order.
            </p>
          </div>
        </section>

        {/* Back Button */}
        <div className="mt-6 flex justify-center pb-4">
          <Link
            to="/orders"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#eadfd3] bg-white px-6 py-3 text-[10px] md:text-[12px] text-[#B5697A] hover:border-[#B5697A] hover:bg-[#fff8f7] focus:outline-none sm:w-auto"
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