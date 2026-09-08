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
      return "bg-blue-50 text-blue-700 border border-blue-100";

    case "PROCESSING":
      return "bg-purple-50 text-purple-700 border border-purple-100";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border border-green-100";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border border-red-100";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border border-amber-100";
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
      return "bg-green-50 text-green-700 border border-green-100";

    case "FAILED":
      return "bg-red-50 text-red-700 border border-red-100";

    case "REFUNDED":
      return "bg-blue-50 text-blue-700 border border-blue-100";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border border-amber-100";
  }
};

/*
 * =========================================================
 * MY ORDERS PAGE
 * =========================================================
 */

function MyOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);

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
      <main className="min-h-screen bg-[#fffaf5]">

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-16">

          {/* Header */}

          <div className="text-center">

            <h1 className="mt-1.5 text-[18px] md:text-[24px] fon-bold tracking-tight text-slate-900">
              My Orders
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              View your previous orders, check their
              current status, and keep track of everything
              you've purchased from us.
            </p>
          </div>

          {/* Loading */}

          <div className="mx-auto mt-10 max-w-5xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm sm:p-12">

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
      <main className="min-h-screen bg-[#fffaf5]">

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-12">

          {/* Header */}

          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b542f] sm:text-xs">
              Your Account
            </span>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              View your previous orders, check their
              current status, and keep track of everything
              you've purchased from us.
            </p>
          </div>

          {/* Error */}

          <div className="mx-auto mt-10 max-w-3xl border border-red-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7 text-red-500"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>

            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
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
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-[#8b542f] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-[0_8px_20px_rgba(117,69,39,0.14)] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
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
      <main className="min-h-screen bg-[#fffaf5]">

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-12">

          {/* Header */}

          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b542f] sm:text-xs">
              Your Account
            </span>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              View your previous orders, check their
              current status, and keep track of everything
              you've purchased from us.
            </p>
          </div>

          {/* Empty State */}

          <div className="mx-auto mt-10 max-w-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-14">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f]">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>

            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
              You haven't placed any orders yet. Explore
              our homemade treats and find something
              you'd love to enjoy.
            </p>

            <Link
              to="/#products"
              className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-[#8b542f] px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-[0_8px_20px_rgba(117,69,39,0.14)] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
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
    <main className="min-h-screen bg-[#fffaf5]">

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pt-24">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="text-center">
          <h1 className="mt-1.5 text-[18px] md:text-[24px] font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Orders
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-[12px] md:sm:text-[15px] font-[350] leading-6 text-slate-500">
            View your previous orders, check their current
            status, and keep track of everything you've
            purchased from us.
          </p>

        </div>

        {/* =================================================
            ORDER TOOLBAR
        ================================================= */}

        <div className="mx-auto mt-9 flex max-w-5xl flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>

            <span
              className="text-slate-300"
              aria-hidden="true"
            >
              •
            </span>

            <button
              type="button"
              onClick={() => {
                void loadOrders();
              }}
              className=" text-[#8b542f] transition-colors hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Refresh
            </button>

          </div>

          <Link
            to="/#products"
            className="group inline-flex h-9 w-fit items-center gap-2 rounded-lg border border-[#d9c7b7] bg-white px-4 text-xs text-[#8b542f] transition-all duration-200 hover:bg-[#f5eadf] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            <span>Continue Shopping</span>
          </Link>

        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mx-auto mt-0 max-w-5xl space-y-5">

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
                className="overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm transition-shadow"
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* Order Information */}

                    <div className="min-w-0">

                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Order Number
                      </p>

                      <h2 className="mt-1 break-all text-[18px] md:text-[20px] font-semibold tracking-tight text-slate-900">
                        {order.orderNumber}
                      </h2>

                      <p className="mt-1 text-xs font-[350] text-slate-500 sm:text-sm">
                        Placed on{" "}
                        {formatOrderDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    {/* Status */}

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-[350] capitalize ${getOrderStatusClasses(
                          order.orderStatus
                        )}`}
                      >
                        Order:{" "}
                        {formatOrderStatus(
                          order.orderStatus
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-[350] capitalize ${getPaymentStatusClasses(
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

                </div>

                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="border-y border-[#eadfd3] bg-[#fdfbf8] px-5 py-4 sm:px-6">

                  <div className="grid gap-4 sm:grid-cols-3">

                    {/* Items */}

                    <div className="sm:border-r sm:border-[#eadfd3] sm:pr-4">

                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                        Items
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {totalItems}{" "}
                        {totalItems === 1
                          ? "Item"
                          : "Items"}
                      </p>

                    </div>

                    {/* Customer */}

                    <div className="sm:border-r sm:border-[#eadfd3] sm:px-4">

                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                        Customer
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {order.customerName}
                      </p>

                    </div>

                    {/* Total */}

                    <div className="sm:pl-4">

                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-base font-semibold text-[#8b542f]">
                        ₹{order.totalAmount}
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    ORDER ITEMS
                ================================================= */}

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <div className="mt-3 space-y-2">

                    {order.items
                      .slice(0, 3)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg gap-4 border border-[#eadfd3] bg-white px-4 py-3"
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-slate-800">
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
                    ORDER FOOTER
                ================================================= */}

                <div className="flex flex-col gap-4 border-t border-[#eadfd3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                  <p className="text-xs leading-5 text-slate-400">
                    Payment status:{" "}
                    <span className="capitalize text-slate-500">
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
                    className="group inline-flex h-9 items-center justify-center rounded-md bg-[#8b542f] px-5 text-xs text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                  >
                    <span>View Order</span>
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