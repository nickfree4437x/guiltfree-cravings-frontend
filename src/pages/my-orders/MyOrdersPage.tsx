import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getMyOrders,
  type Order,
} from "../../api/orderApi";

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const formatOrderDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatOrderStatus = (
  status: Order["orderStatus"]
) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ");
};

const formatPaymentStatus = (
  status: Order["paymentStatus"]
) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ");
};

/*
 * =========================================================
 * ORDER STATUS STYLES
 * =========================================================
 */

const getOrderStatusClasses = (
  status: Order["orderStatus"]
) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "PROCESSING":
      return "bg-purple-100 text-purple-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700";
  }
};

/*
 * =========================================================
 * PAYMENT STATUS STYLES
 * =========================================================
 */

const getPaymentStatusClasses = (
  status: Order["paymentStatus"]
) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "REFUNDED":
      return "bg-blue-100 text-blue-700";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700";
  }
};

/*
 * =========================================================
 * MY ORDERS PAGE
 * =========================================================
 */

function MyOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * =======================================================
   * FETCH ORDERS
   * =======================================================
   */

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );

      setError(
        "Unable to load your orders right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View and track all your orders in one
              place.
            </p>
          </div>

          {/* Loading */}

          <div className="mt-10 rounded-3xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm">

            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
              aria-hidden="true"
            />

            <p className="mt-5 text-sm font-medium text-slate-600">
              Loading your orders...
            </p>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * ERROR STATE
   * =======================================================
   */

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>
          </div>

          {/* Error Card */}

          <div className="mt-10 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>

            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadOrders();
              }}
              className="mt-6 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Try Again
            </button>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * EMPTY ORDERS
   * =======================================================
   */

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View and track all your orders in one
              place.
            </p>
          </div>

          {/* Empty State */}

          <div className="mt-10 rounded-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4d3]">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-9 w-9 text-[#8b542f]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>

            </div>

            <h2 className="mt-7 text-2xl font-bold text-slate-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              You haven't placed any orders yet.
              Explore our products and place your first
              order.
            </p>

            <Link
              to="/#products"
              className="mt-7 inline-flex rounded-full bg-[#8b542f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Start Shopping
            </Link>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * ORDERS LIST
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View and track all your orders in one
              place.
            </p>

          </div>

          <Link
            to="/#products"
            className="inline-flex w-fit items-center rounded-full border border-[#8b542f] bg-white px-5 py-2.5 text-sm font-semibold text-[#8b542f] transition hover:bg-[#8b542f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Continue Shopping
          </Link>

        </div>

        {/* =================================================
            ORDER COUNT
        ================================================= */}

        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">

          <span>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </span>

          <span className="text-slate-300">
            •
          </span>

          <button
            type="button"
            onClick={() => {
              void loadOrders();
            }}
            className="font-semibold text-[#8b542f] transition hover:text-[#744324]"
          >
            Refresh
          </button>

        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mt-6 space-y-5">

          {orders.map((order) => {

            const totalItems =
              order.items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              );

            return (
              <article
                key={order.id}
                className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >

                {/* =================================================
                    ORDER TOP
                ================================================= */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  {/* Order Information */}

                  <div className="min-w-0">

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Order Number
                    </p>

                    <h2 className="mt-2 break-all text-lg font-bold text-slate-900 sm:text-xl">
                      {order.orderNumber}
                    </h2>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                      Placed on{" "}
                      {formatOrderDate(
                        order.createdAt
                      )}
                    </p>

                  </div>

                  {/* Status */}

                  <div className="flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${getOrderStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      Order:{" "}
                      {formatOrderStatus(
                        order.orderStatus
                      )}
                    </span>

                    <span
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                        order.paymentStatus
                      )}`}
                    >
                      Payment:{" "}
                      {formatPaymentStatus(
                        order.paymentStatus
                      )}
                    </span>

                  </div>

                </div>

                <div className="my-6 h-px bg-[#eadfd3]" />

                {/* =================================================
                    ORDER DETAILS
                ================================================= */}

                <div className="grid gap-4 sm:grid-cols-3">

                  {/* Items */}

                  <div className="rounded-2xl bg-[#fffaf5] p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Items
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "Item"
                        : "Items"}
                    </p>

                  </div>

                  {/* Customer */}

                  <div className="rounded-2xl bg-[#fffaf5] p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-2 truncate text-sm font-bold text-slate-800">
                      {order.customerName}
                    </p>

                  </div>

                  {/* Total */}

                  <div className="rounded-2xl bg-[#fffaf5] p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total
                    </p>

                    <p className="mt-2 text-lg font-bold text-[#8b542f]">
                      ₹{order.totalAmount}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    ORDER ITEMS PREVIEW
                ================================================= */}

                <div className="mt-6">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Products
                  </p>

                  <div className="mt-3 space-y-2">

                    {order.items
                      .slice(0, 3)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#eadfd3] px-4 py-3"
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {item.variantQuantity}
                              {item.variantUnit}
                              {" • "}
                              Qty:{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <p className="shrink-0 text-sm font-semibold text-slate-900">
                            ₹{item.subtotal}
                          </p>

                        </div>
                      ))}

                    {order.items.length > 3 && (
                      <p className="pt-1 text-xs text-slate-400">
                        +{" "}
                        {order.items.length - 3}{" "}
                        more{" "}
                        {order.items.length - 3 === 1
                          ? "item"
                          : "items"}
                      </p>
                    )}

                  </div>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-6 flex flex-col gap-3 border-t border-[#eadfd3] pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs leading-5 text-slate-400">
                    Payment status:{" "}
                    <span className="font-semibold capitalize text-slate-500">
                      {formatPaymentStatus(
                        order.paymentStatus
                      )}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/orders/${order.id}`
                      )
                    }
                    className="inline-flex items-center justify-center rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                  >
                    View Order
                    <span
                      className="ml-2"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>

                </div>

              </article>
            );
          })}

        </div>

      </div>
    </main>
  );
}

export default MyOrdersPage;