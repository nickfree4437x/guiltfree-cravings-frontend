import { useMemo, useState } from "react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  itemCount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

/*
 * =========================================================
 * ORDERS PAGE
 * =========================================================
 *
 * UI is ready for the admin order listing API.
 *
 * No delivery functionality is included.
 * No Razorpay functionality is included here.
 *
 * =========================================================
 */

function AdminOrdersPage() {
  const [search, setSearch] = useState("");

  /*
   * API integration ke baad ye state
   * backend se populate hogi.
   */
  const [orders] = useState<AdminOrder[]>([]);

  /*
   * =======================================================
   * SUMMARY COUNTS
   * =======================================================
   */

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.orderStatus === "COMPLETED"
  ).length;

  /*
   * =======================================================
   * SEARCH
   * =======================================================
   */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      return (
        order.orderNumber
          .toLowerCase()
          .includes(query) ||
        order.customerName
          .toLowerCase()
          .includes(query) ||
        order.customerPhone
          .toLowerCase()
          .includes(query)
      );
    });
  }, [orders, search]);

  /*
   * =======================================================
   * FORMAT CURRENCY
   * =======================================================
   */

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /*
   * =======================================================
   * FORMAT DATE
   * =======================================================
   */

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  /*
   * =======================================================
   * ORDER STATUS
   * =======================================================
   */

  const getOrderStatusClass = (
    status: OrderStatus
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "CONFIRMED":
        return "bg-blue-50 text-blue-700";

      case "PROCESSING":
        return "bg-purple-50 text-purple-700";

      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  /*
   * =======================================================
   * PAYMENT STATUS
   * =======================================================
   */

  const getPaymentStatusClass = (
    status: PaymentStatus
  ) => {
    switch (status) {
      case "PAID":
        return "bg-green-50 text-green-700";

      case "FAILED":
        return "bg-red-50 text-red-700";

      case "REFUNDED":
        return "bg-purple-50 text-purple-700";

      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
            Management
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            View and manage customer orders from your
            GuiltFree Cravings store.
          </p>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Orders
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {totalOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All customer orders
            </p>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending
            </p>

            <p className="mt-3 text-2xl font-bold text-amber-600">
              {pendingOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Awaiting confirmation
            </p>
          </div>

          {/* PAID */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Paid Orders
            </p>

            <p className="mt-3 text-2xl font-bold text-green-600">
              {paidOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Successfully paid
            </p>
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed
            </p>

            <p className="mt-3 text-2xl font-bold text-[#8b542f]">
              {completedOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Completed orders
            </p>
          </div>

        </div>

        {/* ===================================================
            ORDERS SECTION
        =================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="border-b border-[#eadfd3] p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredOrders.length} order
                  {filteredOrders.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-sm">

                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                >
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search order or customer..."
                  className="w-full rounded-xl border border-[#d9c7b7] bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3]"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredOrders.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3e8] text-2xl text-[#8b542f]">
                □
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No orders found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "No orders match your search. Try a different order number, customer name, or phone number."
                  : "Customer orders will appear here once orders are created."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#744324]"
                >
                  Clear Search
                </button>
              )}

            </div>
          ) : (

            /* =================================================
               DESKTOP TABLE
            ================================================= */

            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[1050px]">

                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Items
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eadfd3]">

                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-[#fffaf5]"
                    >

                      <td className="px-6 py-5">

                        <p className="text-sm font-bold text-slate-900">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          #{order.id}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <p className="text-sm font-semibold text-slate-800">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.customerPhone}
                        </p>

                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {order.itemCount}{" "}
                        {order.itemCount === 1
                          ? "item"
                          : "items"}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatAmount(
                          order.totalAmount
                        )}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getOrderStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-5 text-right">

                        <button
                          type="button"
                          className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* =================================================
              MOBILE ORDER CARDS
          ================================================= */}

          {filteredOrders.length > 0 && (
            <div className="divide-y divide-[#eadfd3] lg:hidden">

              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className="p-5 sm:p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {formatAmount(
                        order.totalAmount
                      )}
                    </p>

                  </div>

                  <div className="mt-5">

                    <p className="text-sm font-semibold text-slate-800">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.customerPhone}
                    </p>

                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      Payment:{" "}
                      {order.paymentStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${getOrderStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <p className="text-xs text-slate-500">
                      {order.itemCount}{" "}
                      {order.itemCount === 1
                        ? "item"
                        : "items"}
                    </p>

                    <button
                      type="button"
                      className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
                    >
                      View Order
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default AdminOrdersPage;