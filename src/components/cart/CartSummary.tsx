import { Link } from "react-router-dom";

interface CartSummaryProps {
  cartTotal: number;
  onProceedToCheckout: () => void;
}

function CartSummary({
  cartTotal,
  onProceedToCheckout,
}: CartSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="border border-[#eadfd3] bg-white p-5 sm:p-6 rounded-md">
        {/* =================================================
            HEADER
        ================================================== */}

        <div>

          <h2 className="mt-1.5 text-[18px] md:text-[22px] text-center font-semibold tracking-tight text-slate-900">
            Order Summary
          </h2>
        </div>

        {/* =================================================
            SUMMARY
        ================================================== */}

        <div className="mt-6 space-y-4">
          {/* Subtotal */}

          <div className="flex items-center justify-between gap-4 text-[12px] md:text-[14.5px] font-[350]">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-900">
              ₹{cartTotal}
            </span>
          </div>

          {/* Delivery */}

          <div className="flex items-start justify-between gap-4 text-[12px] md:text-[14.5px] font-[350]">
            <span className="text-slate-500">
              Delivery
            </span>

            <span className="text-right text-xs text-slate-400">
              Calculated later
            </span>
          </div>

          <div className="h-px bg-[#eadfd3]" />

          {/* Total */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-slate-900">
              Total
            </span>

            <span className="text-xl font-semibold text-[#8b542f]">
              ₹{cartTotal}
            </span>
          </div>
        </div>

        {/* =================================================
            CHECKOUT
        ================================================== */}

        <button
          type="button"
          onClick={onProceedToCheckout}
          className="mt-7 flex h-11 w-full items-center justify-center rounded-md bg-[#8b542f] px-5 text-sm text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-[0_8px_20px_rgba(117,69,39,0.16)] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Proceed to Checkout
        </button>

        <p className="mt-4 text-center text-[11px] md:text-[12px] font-[350] leading-5 text-slate-500">
          Secure checkout. Payment options will be
          available at the next step.
        </p>

        {/* =================================================
            CONTINUE SHOPPING
        ================================================== */}

        <Link
          to="/#products"
          className="group mt-5 flex items-center justify-center gap-1.5 text-xs hover:underline text-[#8b542f] transition-colors duration-200 hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>
    </aside>
  );
}

export default CartSummary;