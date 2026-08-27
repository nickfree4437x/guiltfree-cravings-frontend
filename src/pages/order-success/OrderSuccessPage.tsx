import { Link, useLocation } from "react-router-dom";

import type { Order } from "../../api/orderApi";

/*
 * =========================================================
 * LOCATION STATE
 * =========================================================
 */

interface OrderSuccessLocationState {
  order?: Order;
}

/*
 * =========================================================
 * ORDER SUCCESS PAGE
 * =========================================================
 */

function OrderSuccessPage() {
  const location = useLocation();

  const locationState =
    location.state as
      | OrderSuccessLocationState
      | null;

  const order = locationState?.order;

  /*
   * =======================================================
   * ORDER INFORMATION MISSING
   * =======================================================
   *
   * Prevent users from directly opening:
   *
   * /order-success
   *
   * without a valid order.
   */

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6 py-16">
        <div className="w-full max-w-md text-center">

          {/* Icon */}

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
                d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900">
            Order Information Missing
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            We could not find the order information
            for this page. Please go back and review
            your order.
          </p>

          <Link
            to="/checkout/review"
            className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Back to Review
          </Link>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * ORDER SUCCESS
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <section className="rounded-3xl border border-[#eadfd3] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">

          {/* Success Icon */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-10 w-10 text-green-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
              />
            </svg>
          </div>

          <span className="mt-7 inline-flex rounded-full bg-[#f3e4d3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b542f]">
            Order Created
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your Order Has Been Created!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Thank you for choosing GuiltFree Cravings.
            Your order has been successfully created
            and is currently awaiting payment confirmation.
          </p>

        </section>

        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Order Number
              </p>

              <h2 className="mt-2 break-all text-xl font-bold text-slate-900 sm:text-2xl">
                {order.orderNumber}
              </h2>

            </div>

            {/* Payment Status */}

            <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              {order.paymentStatus}
            </span>

          </div>

          <div className="my-7 h-px bg-[#eadfd3]" />

          {/* =================================================
              ORDER DETAILS GRID
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Customer */}

            <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </p>

              <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                {order.customerName}
              </p>

            </div>

            {/* Phone */}

            <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mobile Number
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                +91 {order.customerPhone}
              </p>

            </div>

            {/* Email */}

            <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                {order.customerEmail || "Not provided"}
              </p>

            </div>

            {/* Order Status */}

            <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Order Status
              </p>

              <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                {order.orderStatus
                  .toLowerCase()
                  .replace(/_/g, " ")}
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-xl font-bold text-slate-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4"
              >

                {/* Product */}

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-slate-800 sm:text-base">
                    {item.productName}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">

                    <span className="text-xs font-medium text-[#8b542f]">
                      {item.variantQuantity}
                      {item.variantUnit}
                    </span>

                    <span className="text-xs text-slate-300">
                      •
                    </span>

                    <span className="text-xs capitalize text-slate-400">
                      {item.packaging}
                    </span>

                    <span className="text-xs text-slate-300">
                      •
                    </span>

                    <span className="text-xs text-slate-500">
                      Qty: {item.quantity}
                    </span>

                  </div>

                </div>

                {/* Item Total */}

                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  ₹{item.subtotal}
                </p>

              </div>
            ))}

          </div>

          <div className="my-6 h-px bg-[#eadfd3]" />

          {/* Subtotal */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-semibold text-slate-900">
              ₹{order.subtotal}
            </span>

          </div>

          <div className="my-5 h-px bg-[#eadfd3]" />

          {/* Total */}

          <div className="flex items-center justify-between">

            <span className="text-base font-bold text-slate-900 sm:text-lg">
              Total
            </span>

            <span className="text-2xl font-bold text-[#8b542f] sm:text-3xl">
              ₹{order.totalAmount}
            </span>

          </div>

        </section>

        {/* =================================================
            PAYMENT NOTICE
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 shrink-0 text-amber-600">
              ⚠
            </div>

            <div>

              <h2 className="text-sm font-bold text-amber-800">
                Payment Confirmation Pending
              </h2>

              <p className="mt-1 text-xs leading-5 text-amber-700 sm:text-sm">
                This is currently a development/testing
                flow. Razorpay payment integration is not
                connected yet, so this order has not been
                marked as paid.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-full bg-[#8b542f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            View My Orders
          </Link>

          <Link
            to="/#products"
            className="inline-flex items-center justify-center rounded-full border border-[#8b542f] bg-white px-7 py-3.5 text-sm font-semibold text-[#8b542f] transition hover:bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </main>
  );
}

export default OrderSuccessPage;