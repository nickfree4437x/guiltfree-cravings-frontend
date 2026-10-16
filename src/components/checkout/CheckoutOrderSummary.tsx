
import type { CartItem } from "../../store/cartStore";
import { FaEdit } from "react-icons/fa";
import { X } from "lucide-react";

import CheckoutOrderItems from "./CheckoutOrderItems";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  isSubmitting: boolean;
  onEditOrder?: () => void;

  // Coupon props
  couponCode: string;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isApplyingCoupon: boolean;
  couponError: string;
  couponMessage: string;
  discountAmount: number;
  appliedCouponCode: string;
}

function CheckoutOrderSummary({
  items,
  cartTotal,
  isSubmitting,
  onEditOrder,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  couponError,
  couponMessage,
  discountAmount,
  appliedCouponCode,
}: CheckoutOrderSummaryProps) {
  const finalAmount = Math.max(0, cartTotal - discountAmount);

  return (
    <aside className="w-full">
      <div className="overflow-hidden rounded-lg bg-white">
        {/* HEADER */}
        <div className="border-b border-[#F0E2E5] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#2C2C2C] sm:text-[18px]">
                Order Summary
              </h2>
              <p className="text-[10px] leading-relxed text-slate-500 font-[350] sm:text-[11px]">
                Review your items before continuing
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {onEditOrder && (
                <div className="group relative">
                  <button
                    type="button"
                    onClick={onEditOrder}
                    disabled={isSubmitting}
                    aria-label="Edit order items"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaEdit className="h-3 w-3" />
                  </button>

                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
                  >
                    Edit Order
                  </span>
                </div>
              )}

              <span className="rounded-full bg-[#F8E8EC] px-3 py-1 text-[10px] text-[#B5697A] sm:text-[11px]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <CheckoutOrderItems items={items} />
        </div>

        {/* COUPON SECTION */}
        <div className="px-5 pt-3 sm:px-6">
          <div className="rounded-lg border border-[#F0E2E5] p-4">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#2C2C2C]">
                Apply Coupon Code
              </h3>
            </div>

            {appliedCouponCode ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-green-800">
                    {appliedCouponCode}
                  </p>
                  <p className="mt-1 text-[11px] text-green-700">
                    {couponMessage || "Coupon applied successfully"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onRemoveCoupon}
                  disabled={isSubmitting || isApplyingCoupon}
                  className="flex shrink-0 items-center gap-1 text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) =>
                      onCouponCodeChange(event.target.value.toUpperCase())
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        onApplyCoupon();
                      }
                    }}
                    placeholder="Enter coupon code"
                    maxLength={50}
                    disabled={isSubmitting || isApplyingCoupon}
                    aria-label="Coupon code"
                    aria-invalid={Boolean(couponError)}
                    className="min-w-0 flex-1 rounded-md border border-[#E8D9DD] px-3 py-2.5 text-xs uppercase text-[#2C2C2C] outline-none transition focus:border-[#B5697A] disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={onApplyCoupon}
                    disabled={
                      isSubmitting ||
                      isApplyingCoupon ||
                      !couponCode.trim()
                    }
                    className="min-w-[76px] rounded-md bg-[#B5697A] px-4 py-2 text-xs text-white transition hover:bg-[#A75D70] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isApplyingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>

                {couponError && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {couponError}
                  </p>
                )}

                {!couponError && couponMessage && (
                  <p className="mt-2 text-xs text-green-700">
                    {couponMessage}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="px-5 sm:px-6">
          <div className="my-4 bg-[#F0E2E5]" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-600">Subtotal</span>
              <span className="text-sm font-medium text-[#2C2C2C]">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-green-700">
                  Coupon discount
                </span>
                <span className="text-sm font-semibold text-green-700">
                  −₹{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-end justify-between gap-4 border-t border-[#F0E2E5] pt-3">
              <div>
                <p className="text-sm font-semibold text-[#2C2C2C]">
                  Total
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Inclusive of current cart items
                </p>
              </div>

              <span className="text-[21px] font-bold tracking-[-0.02em] text-[#B5697A]">
                ₹{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* CONTINUE BUTTON */}
        <div className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
          <button
            type="submit"
            disabled={isSubmitting || isApplyingCoupon}
            className="flex min-h-[45px] w-full items-center justify-center rounded-full bg-[#B5697A] px-6 py-2.5 text-xs tracking-[0.01em] text-white shadow transition-all duration-200 hover:bg-[#A75D70] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5697A]/30 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
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
              "Proceed to Payment"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CheckoutOrderSummary;
