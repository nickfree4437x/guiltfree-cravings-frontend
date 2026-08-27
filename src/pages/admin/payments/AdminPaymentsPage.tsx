import { useMemo, useState } from "react";

/*
 * =========================================================
 * PAYMENT TYPE
 * =========================================================
 */

type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "FAILED"
  | "REFUNDED";

interface Payment {
  id: number;
  paymentId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

/*
 * =========================================================
 * TEMPORARY PAYMENT DATA
 * =========================================================
 *
 * This is UI-only data for now.
 * Real payment data will come from the backend/Razorpay
 * integration later.
 */

const payments: Payment[] = [
  {
    id: 1,
    paymentId: "PAY-10001",
    orderNumber: "GFC-10001",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    amount: 1299,
    status: "PAID",
    method: "Online",
    createdAt: "27 Aug 2026, 11:42 AM",
  },
  {
    id: 2,
    paymentId: "PAY-10002",
    orderNumber: "GFC-10002",
    customerName: "Priya Verma",
    customerPhone: "+91 98123 45678",
    amount: 899,
    status: "PENDING",
    method: "Online",
    createdAt: "27 Aug 2026, 10:18 AM",
  },
  {
    id: 3,
    paymentId: "PAY-10003",
    orderNumber: "GFC-10003",
    customerName: "Amit Kumar",
    customerPhone: "+91 97654 32109",
    amount: 1599,
    status: "PAID",
    method: "Online",
    createdAt: "26 Aug 2026, 06:35 PM",
  },
  {
    id: 4,
    paymentId: "PAY-10004",
    orderNumber: "GFC-10004",
    customerName: "Neha Singh",
    customerPhone: "+91 99887 66554",
    amount: 749,
    status: "FAILED",
    method: "Online",
    createdAt: "26 Aug 2026, 04:12 PM",
  },
  {
    id: 5,
    paymentId: "PAY-10005",
    orderNumber: "GFC-10005",
    customerName: "Karan Mehta",
    customerPhone: "+91 98989 77665",
    amount: 2199,
    status: "REFUNDED",
    method: "Online",
    createdAt: "25 Aug 2026, 02:46 PM",
  },
];

/*
 * =========================================================
 * STATUS STYLES
 * =========================================================
 */

const getStatusClasses = (
  status: PaymentStatus
) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700 border-green-200";

    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";

    case "REFUNDED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

/*
 * =========================================================
 * ADMIN PAYMENTS PAGE
 * =========================================================
 */

function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | PaymentStatus>("ALL");

  const [search, setSearch] =
    useState("");

  /*
   * =======================================================
   * PAYMENT STATS
   * =======================================================
   */

  const totalPayments = payments.length;

  const paidPayments = payments.filter(
    (payment) => payment.status === "PAID"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "FAILED"
  );

  // const refundedPayments = payments.filter(
  //   (payment) => payment.status === "REFUNDED"
  // );

  const totalCollected = paidPayments.reduce(
    (total, payment) =>
      total + payment.amount,
    0
  );

  /*
   * =======================================================
   * FILTER PAYMENTS
   * =======================================================
   */

  const filteredPayments = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        payment.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        payment.paymentId
          .toLowerCase()
          .includes(normalizedSearch) ||
        payment.orderNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        payment.customerName
          .toLowerCase()
          .includes(normalizedSearch) ||
        payment.customerPhone
          .toLowerCase()
          .includes(normalizedSearch);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Payments
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Payment Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View and monitor payment activity,
              transaction status, and collected amounts.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">
              Payment Gateway
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Razorpay integration pending
            </p>
          </div>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* TOTAL */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Payments
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {totalPayments}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All transactions
            </p>
          </div>

          {/* PAID */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Paid
            </p>

            <p className="mt-3 text-2xl font-bold text-green-700">
              {paidPayments.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Successful payments
            </p>
          </div>

          {/* PENDING */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending
            </p>

            <p className="mt-3 text-2xl font-bold text-amber-600">
              {pendingPayments.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Awaiting confirmation
            </p>
          </div>

          {/* FAILED */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Failed
            </p>

            <p className="mt-3 text-2xl font-bold text-red-600">
              {failedPayments.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Failed transactions
            </p>
          </div>

          {/* COLLECTED */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Collected
            </p>

            <p className="mt-3 text-2xl font-bold text-[#8b542f]">
              ₹{totalCollected.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Successfully received
            </p>
          </div>

        </div>

        {/* =================================================
            PAYMENTS SECTION
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="border-b border-[#eadfd3] p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Payments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Payment transactions recorded in the system.
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-xs">

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search payment..."
                  className="w-full rounded-2xl border border-[#d9c7b7] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3]"
                />

              </div>

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

              {(
                [
                  ["ALL", "All"],
                  ["PAID", "Paid"],
                  ["PENDING", "Pending"],
                  ["FAILED", "Failed"],
                  ["REFUNDED", "Refunded"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(value)
                  }
                  className={[
                    "whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition",
                    statusFilter === value
                      ? "bg-[#8b542f] text-white"
                      : "bg-[#fffaf5] text-slate-600 hover:bg-[#fff3e8] hover:text-[#8b542f]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}

            </div>

          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-[#eadfd3] bg-[#fffaf5]">

                <tr>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#eadfd3]">

                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition hover:bg-[#fffaf5]"
                  >

                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">
                        {payment.paymentId}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-[#8b542f]">
                        {payment.orderNumber}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-900">
                        {payment.customerName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {payment.customerPhone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">
                        {payment.method}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold",
                          getStatusClasses(payment.status),
                        ].join(" ")}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-500">
                        {payment.createdAt}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* =================================================
              MOBILE PAYMENT CARDS
          ================================================= */}

          <div className="divide-y divide-[#eadfd3] lg:hidden">

            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {payment.paymentId}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8b542f]">
                      {payment.orderNumber}
                    </p>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold",
                      getStatusClasses(payment.status),
                    ].join(" ")}
                  >
                    {payment.status}
                  </span>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {payment.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Method
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {payment.method}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.createdAt}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredPayments.length === 0 && (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3e8] text-xl text-[#8b542f]">
                ₹
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No payments found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the search or payment status
                filter.
              </p>

            </div>
          )}

        </section>

        {/* =================================================
            INTEGRATION NOTE
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e8] font-bold text-[#8b542f]">
              i
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Payment Gateway Integration
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Payment records are currently displayed using
                temporary admin data. Once the Razorpay
                credentials and payment integration are
                available, this section will be connected to
                actual transaction data.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminPaymentsPage;