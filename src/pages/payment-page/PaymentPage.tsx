import { useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type { Order } from "../../api/orderApi";

import { useCartStore } from "../../store/cartStore";

/*
 * =========================================================
 * CUSTOMER DETAILS
 * =========================================================
 */

interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

/*
 * =========================================================
 * PAYMENT LOCATION STATE
 * =========================================================
 */

interface PaymentLocationState {
  order?: Order;
  customer?: CustomerDetails;
}

/*
 * =========================================================
 * PAYMENT METHOD
 * =========================================================
 */

type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking";

/*
 * =========================================================
 * PAYMENT PAGE
 * =========================================================
 */

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * =======================================================
   * CART
   * =======================================================
   *
   * Cart is used only to display item count.
   *
   * Payment amount is NEVER calculated from cart.
   * Backend-created order.totalAmount is the source
   * of truth.
   */

  const items = useCartStore(
    (state) => state.items
  );

  /*
   * =======================================================
   * LOCATION STATE
   * =======================================================
   */

  const locationState =
    location.state as
      | PaymentLocationState
      | null;

  const order = locationState?.order;

  const customer =
    locationState?.customer;

  /*
   * =======================================================
   * PAYMENT STATE
   * =======================================================
   */

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [
    isPaymentProcessing,
    setIsPaymentProcessing,
  ] = useState(false);

  /*
   * =======================================================
   * TOTAL ITEMS
   * =======================================================
   */

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  /*
   * =======================================================
   * ORDER VALIDATION
   * =======================================================
   *
   * Payment page should only be opened after
   * a successful order creation.
   */

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6 py-16">
        <div className="w-full max-w-md text-center">

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

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Order Information Missing
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            We could not find a valid order for this
            payment session. Please review your order
            again.
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
   * CUSTOMER FALLBACK
   * =======================================================
   *
   * Order contains customer information as well,
   * so payment page remains safe even if the navigation
   * state does not contain customer details.
   */

  const paymentCustomer: CustomerDetails = {
    fullName:
      customer?.fullName ||
      order.customerName,

    phone:
      customer?.phone ||
      order.customerPhone,

    email:
      customer?.email ||
      order.customerEmail ||
      "",
  };

  /*
   * =======================================================
   * PAYABLE AMOUNT
   * =======================================================
   *
   * IMPORTANT:
   *
   * Backend-created order.totalAmount is the only
   * amount used on this page.
   *
   * No frontend price calculation.
   * No delivery fee.
   */

  const payableAmount =
    order.totalAmount;

  /*
   * =======================================================
   * BACK TO REVIEW
   * =======================================================
   */

  const handleBackToReview = () => {
    if (isPaymentProcessing) {
      return;
    }

    navigate("/checkout/review", {
      state: {
        customer: paymentCustomer,
      },
    });
  };

  /*
   * =======================================================
   * TEMPORARY PAYMENT ACTION
   * =======================================================
   *
   * Razorpay is NOT connected yet.
   *
   * For development/testing:
   *
   * Pay Now
   *    ↓
   * Order Success
   *
   * IMPORTANT:
   *
   * - Do NOT mark payment as PAID
   * - Do NOT update order status
   * - Do NOT clear cart
   *
   * Real payment verification will be added when
   * Razorpay is integrated.
   */

  const handlePayment = () => {
    if (isPaymentProcessing) {
      return;
    }

    setIsPaymentProcessing(true);

    /*
     * Small UI delay so the button gives proper
     * loading feedback before redirecting.
     */

    window.setTimeout(() => {
      navigate("/order-success", {
        state: {
          order,
        },
      });
    }, 500);
  };

  /*
   * =======================================================
   * PAYMENT PAGE
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            BACK TO REVIEW
        ================================================= */}

        <button
          type="button"
          onClick={handleBackToReview}
          disabled={isPaymentProcessing}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b542f] transition hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">
            ←
          </span>

          Back to Review
        </button>

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mt-8">

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Secure Checkout
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Payment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Complete the payment for your order.
          </p>

        </div>

        {/* =================================================
            ORDER CREATED NOTICE
        ================================================= */}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            ✓
          </div>

          <div className="min-w-0">

            <p className="text-sm font-semibold text-green-800">
              Order created successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-green-700">
              Order Number:{" "}
              <span className="font-semibold">
                {order.orderNumber}
              </span>
            </p>

          </div>

        </div>

        {/* =================================================
            PAYMENT LAYOUT
        ================================================= */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* =================================================
              PAYMENT METHODS
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Select Payment Method
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose your preferred payment method.
              </p>

            </div>

            <div className="mt-7 space-y-4">

              {/* =================================================
                  UPI
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("upi")
                }
                disabled={isPaymentProcessing}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "upi"
                    ? "border-[#8b542f] bg-[#fffaf5] ring-2 ring-[#f3e4d3]"
                    : "border-[#eadfd3] bg-white hover:border-[#d9c7b7] hover:bg-[#fffaf5]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e4d3] text-sm font-bold text-[#8b542f]">
                    UPI
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-slate-900">
                      UPI
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pay using your preferred UPI app.
                    </p>

                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod === "upi"
                        ? "border-[#8b542f]"
                        : "border-slate-300"
                    }`}
                    aria-hidden="true"
                  >
                    {paymentMethod === "upi" && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#8b542f]" />
                    )}
                  </div>

                </div>

              </button>

              {/* =================================================
                  CARD
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("card")
                }
                disabled={isPaymentProcessing}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "card"
                    ? "border-[#8b542f] bg-[#fffaf5] ring-2 ring-[#f3e4d3]"
                    : "border-[#eadfd3] bg-white hover:border-[#d9c7b7] hover:bg-[#fffaf5]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e4d3] text-lg text-[#8b542f]">
                    💳
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-slate-900">
                      Credit / Debit Card
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pay securely using your card.
                    </p>

                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod === "card"
                        ? "border-[#8b542f]"
                        : "border-slate-300"
                    }`}
                    aria-hidden="true"
                  >
                    {paymentMethod === "card" && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#8b542f]" />
                    )}
                  </div>

                </div>

              </button>

              {/* =================================================
                  NET BANKING
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod(
                    "netbanking"
                  )
                }
                disabled={isPaymentProcessing}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "netbanking"
                    ? "border-[#8b542f] bg-[#fffaf5] ring-2 ring-[#f3e4d3]"
                    : "border-[#eadfd3] bg-white hover:border-[#d9c7b7] hover:bg-[#fffaf5]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e4d3] text-lg text-[#8b542f]">
                    🏦
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-slate-900">
                      Net Banking
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pay directly through your bank.
                    </p>

                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod ===
                      "netbanking"
                        ? "border-[#8b542f]"
                        : "border-slate-300"
                    }`}
                    aria-hidden="true"
                  >
                    {paymentMethod ===
                      "netbanking" && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#8b542f]" />
                    )}
                  </div>

                </div>

              </button>

            </div>

            {/* =================================================
                PAYMENT GATEWAY STATUS
            ================================================= */}

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">

              <div className="flex items-start gap-3">

                <div
                  className="mt-0.5 shrink-0 text-amber-600"
                  aria-hidden="true"
                >
                  ⚠
                </div>

                <div>

                  <p className="text-sm font-semibold text-amber-800">
                    Payment gateway pending
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Razorpay integration is not connected yet.
                    You can continue through the temporary
                    development flow for testing.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                SECURITY NOTICE
            ================================================= */}

            <div className="mt-5 flex gap-3 rounded-2xl bg-[#fffaf5] p-4">

              <div
                className="mt-0.5 shrink-0 text-[#8b542f]"
                aria-hidden="true"
              >
                🔒
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Razorpay will be connected here once the
                  payment gateway credentials and API access
                  are available.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">

            <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              {/* =================================================
                  ORDER NUMBER
              ================================================= */}

              <div className="mt-6 rounded-2xl bg-[#fffaf5] p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order Number
                </p>

                <p className="mt-2 break-all text-sm font-bold text-slate-800">
                  {order.orderNumber}
                </p>

              </div>

              {/* =================================================
                  CUSTOMER
              ================================================= */}

              <div className="mt-4 rounded-2xl bg-[#fffaf5] p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  {paymentCustomer.fullName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  +91 {paymentCustomer.phone}
                </p>

                {paymentCustomer.email && (
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {paymentCustomer.email}
                  </p>
                )}

              </div>

              {/* =================================================
                  ITEMS
              ================================================= */}

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Items
                  </span>

                  <span className="font-semibold text-slate-800">
                    {totalItems}
                  </span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900">
                    ₹{order.subtotal}
                  </span>

                </div>

              </div>

              <div className="my-6 h-px bg-[#eadfd3]" />

              {/* =================================================
                  TOTAL
              ================================================= */}

              <div className="flex items-center justify-between">

                <span className="text-base font-bold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#8b542f]">
                  ₹{payableAmount}
                </span>

              </div>

              {/* =================================================
                  PAYMENT STATUS
              ================================================= */}

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">

                <span className="text-xs font-medium text-slate-500">
                  Payment Status
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                  {order.paymentStatus}
                </span>

              </div>

              {/* =================================================
                  PAY NOW
              ================================================= */}

              <button
                type="button"
                onClick={handlePayment}
                disabled={isPaymentProcessing}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {isPaymentProcessing ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />

                    Processing...
                  </>
                ) : (
                  `Pay ₹${payableAmount}`
                )}

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Development mode: payment gateway is
                currently pending.
              </p>

              {/* =================================================
                  BACK TO REVIEW
              ================================================= */}

              <button
                type="button"
                onClick={handleBackToReview}
                disabled={isPaymentProcessing}
                className="mt-4 block w-full text-center text-xs font-semibold text-[#8b542f] transition hover:text-[#744324] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Return to Review
              </button>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default PaymentPage;