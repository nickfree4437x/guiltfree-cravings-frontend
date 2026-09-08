import { Link } from "react-router-dom";

interface ReviewOrderSummaryProps {
  totalItems: number;
  cartTotal: number;
  orderError: string;
  isCreatingOrder: boolean;
  onProceedToPayment: () => void;
}

function ReviewOrderSummary({
  totalItems,
  cartTotal,
  orderError,
  isCreatingOrder,
  onProceedToPayment,
}: ReviewOrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-24">

      <div className="rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <h2 className="text-xl font-bold text-slate-900">
          Order Summary
        </h2>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mt-6 space-y-4">

          {/* Items */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-500">
              Items
            </span>

            <span className="font-medium text-slate-800">
              {totalItems}
            </span>

          </div>

          {/* Subtotal */}

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-semibold text-slate-900">
              ₹{cartTotal}
            </span>

          </div>

        </div>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-6 h-px bg-[#eadfd3]" />

        {/* =================================================
            TOTAL
        ================================================= */}

        <div className="flex items-center justify-between">

          <span className="text-base font-bold text-slate-900">
            Total
          </span>

          <span className="text-2xl font-bold text-[#8b542f]">
            ₹{cartTotal}
          </span>

        </div>

        {/* =================================================
            ORDER ERROR
        ================================================= */}

        {orderError && (
          <div
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4"
            role="alert"
          >
            <p className="text-sm font-medium leading-5 text-red-700">
              {orderError}
            </p>
          </div>
        )}

        {/* =================================================
            PROCEED TO PAYMENT
        ================================================= */}

        <button
          type="button"
          onClick={onProceedToPayment}
          disabled={isCreatingOrder}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3 text-sm text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCreatingOrder ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />

              Creating Order...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>

        {/* =================================================
            PAYMENT NOTICE
        ================================================= */}

        <div className="mt-4 rounded-2xl bg-[#fffaf5] p-4">

          <p className="text-center text-xs font-[350] leading-5 text-slate-500">
            Your order will be created first.
            Payment will be completed on the
            next step.
          </p>

        </div>

        {/* =================================================
            BACK TO CART
        ================================================= */}

        <Link
          to="/cart"
          className={`mt-4 block text-center text-xs hover:underline text-[#8b542f] transition hover:text-[#744324] ${
            isCreatingOrder
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          Return to Cart
        </Link>

      </div>

    </aside>
  );
}

export default ReviewOrderSummary;