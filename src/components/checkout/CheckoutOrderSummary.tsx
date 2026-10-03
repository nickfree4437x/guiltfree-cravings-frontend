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
    <aside className="w-full">
      <div
        className="
          overflow-hidden
          rounded-lg
          bg-white
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            border-b
            border-[#F0E2E5]
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#2C2C2C]
                  sm:text-[18px]
                "
              >
                Order Summary
              </h2>

              <p
                className="
                  mt-0
                  text-[11px]
                  leading-5
                  text-slate-500
                  sm:text-xs
                "
              >
                Review your items before continuing
              </p>
            </div>

            {/* Item count */}

            <span
              className="
                rounded-full
                bg-[#F8E8EC]
                px-3
                py-1
                text-[10px]
                text-[#B5697A]
                sm:text-[11px]
              "
            >
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>
          </div>
        </div>

        {/* =====================================================
            ORDER ITEMS
        ===================================================== */}

        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <CheckoutOrderItems
            items={items}
          />
        </div>

        {/* =====================================================
            PRICE BREAKDOWN
        ===================================================== */}

        <div className="px-5 sm:px-6">
          <div
            className="
              my-3
              h-px
              bg-[#F0E2E5]
            "
          />


          {/* Total */}

          <div
            className="
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[14px]
                  font-semibold
                  text-[#2C2C2C]
                "
              >
                Total
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-500
                "
              >
                Inclusive of current cart items
              </p>
            </div>

            <span
              className="
                text-[21px]
                font-bold
                tracking-[-0.02em]
                text-[#B5697A]
              "
            >
              ₹{cartTotal}
            </span>
          </div>
        </div>

        {/* =====================================================
            CONTINUE BUTTON
        ===================================================== */}

        <div className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex
              min-h-[45px]
              w-full
              items-center
              justify-center
              rounded-full
              bg-[#B5697A]
              px-6
              py-2.5
              text-[12px]
              tracking-[0.01em]
              text-white
              shadow
              transition-all
              duration-200
              hover:bg-[#A75D70]
              hover:shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#B5697A]/30
              focus:ring-offset-2
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:shadow-none
            "
          >
            {isSubmitting ? (
              <>
                <span
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                  aria-hidden="true"
                />

                Saving Details...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>

        </div>
      </div>
    </aside>
  );
}

export default CheckoutOrderSummary;