import type { CartItem } from "../../store/cartStore";

import CheckoutOrderItems from "./CheckoutOrderItems";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  isSubmitting: boolean;
}

function CheckoutOrderSummary({
  items,
  cartTotal,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-24">

      <div className="rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

        <h2 className="text-xl font-bold text-slate-900">
          Order Summary
        </h2>

        <CheckoutOrderItems
          items={items}
        />

        <div className="my-6 h-px bg-[#eadfd3]" />

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Subtotal
          </span>

          <span className=" text-slate-900">
            ₹{cartTotal}
          </span>

        </div>

        <div className="my-5 h-px bg-[#eadfd3]" />

        <div className="flex items-center justify-between">

          <span className="text-base font-bold text-slate-900">
            Total
          </span>

          <span className="text-xl font-bold text-[#8b542f]">
            ₹{cartTotal}
          </span>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 flex w-full items-center justify-center rounded-full bg-[#8b542f] px-6 py-3 text-[12px] md:text-[14px] text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />

              Saving Details...
            </>
          ) : (
            "Continue to Review"
          )}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-slate-400">
          You'll review your complete order
          before proceeding to payment.
        </p>

      </div>

    </aside>
  );
}

export default CheckoutOrderSummary;