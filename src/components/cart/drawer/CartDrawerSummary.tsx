import {
  ShieldCheck,
} from "lucide-react";

import type { DeliveryZone } from "./CartDrawer";

interface CartDrawerSummaryProps {
  cartTotal: number;
  deliveryZone: DeliveryZone;
  onCheckout: () => void;
}

const FREE_DWARKA_THRESHOLD = 500;

function CartDrawerSummary({
  cartTotal,
  deliveryZone,
  onCheckout,
}: CartDrawerSummaryProps) {
  const hasFreeDwarkaDelivery =
    cartTotal >= FREE_DWARKA_THRESHOLD;

  const isOutsideDwarka =
    deliveryZone === "outside-dwarka";

  return (
    <div
      className="
        shrink-0

        border-t
        border-[#E9E0D5]

        bg-white

        px-4
        pb-[calc(14px+env(safe-area-inset-bottom))]
        pt-3.5

        sm:px-5
        sm:pb-5
        sm:pt-4

        md:px-6
      "
    >
      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="space-y-2.5">
        {/* SUBTOTAL */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            text-[12px]

            sm:text-[13px]
          "
        >
          <span className="text-[#6F6259]">
            Subtotal
          </span>

          <span
            className="
              shrink-0
              font-medium
              text-[#2C2C2C]
            "
          >
            ₹{cartTotal.toFixed(0)}
          </span>
        </div>

        {/* DELIVERY */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            text-[12px]

            sm:items-center
            sm:text-[13px]
          "
        >
          <span className="text-[#6F6259]">
            Delivery Charges
          </span>

          <span
            className="
              max-w-[65%]
              text-right
              text-[11px]
              leading-4

              sm:text-[12px]
            "
          >
            {isOutsideDwarka ? (
              <span className="text-[#16845F]">
                Actual Porter Cost
                <span className="hidden sm:inline">
                  {" "}
                  (Paid on Delivery)
                </span>
              </span>
            ) : hasFreeDwarkaDelivery ? (
              <span className="text-[#16845F]">
                FREE Dwarka Delivery
              </span>
            ) : (
              <span className="text-[#16845F]">
                Standard Dwarka Delivery
              </span>
            )}
          </span>
        </div>

        {/* DIVIDER */}

        <div
          className="
            my-2.5
            border-t
            border-[#E8D9DD]

            sm:my-3
          "
        />

        {/* TOTAL */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <span
            className="
              text-[14px]
              font-semibold
              text-[#2C2C2C]

              sm:text-[15px]
            "
          >
            Total
          </span>

          <span
            className="
              shrink-0
              text-[18px]
              font-semibold
              tracking-[-0.02em]
              text-[#B5697A]

              sm:text-[20px]
            "
          >
            ₹{cartTotal.toFixed(0)}
          </span>
        </div>
      </div>

      {/* =====================================================
          CHECKOUT BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={onCheckout}
        className="
          mt-3

          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2

          rounded-full

          bg-[#B5697A]

          px-5

          text-[13px]
          text-white

          shadow

          transition-all
          duration-200

          hover:bg-[#A85D6F]
          hover:shadow-sm

          focus:outline-none
          focus:ring-2
          focus:ring-[#B5697A]/25
          focus:ring-offset-2

          active:scale-[0.99]

          sm:mt-3
          sm:h-11
          sm:text-[13.5px]
        "
      >
        <span>
          Proceed to Checkout
        </span>
      </button>

      {/* =====================================================
          SECURITY NOTE
      ===================================================== */}

      <div
        className="
          mt-2
          flex
          items-center
          justify-center
          gap-1.5
          px-2
          text-center

          sm:mt-2.5
        "
      >
        <ShieldCheck
          size={13}
          strokeWidth={1.8}
          className="shrink-0 text-[#B5697A]"
        />

        <p
          className="
            text-[9px]
            leading-4
            text-slate-500

            sm:text-[10px]
          "
        >
          Secure checkout & protected payment
        </p>
      </div>
    </div>
  );
}

export default CartDrawerSummary;