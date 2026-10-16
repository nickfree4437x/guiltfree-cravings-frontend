import { Info } from "lucide-react";

function OrderSuccessPaymentNotice() {
  return (
    <section
      role="status"
      aria-labelledby="payment-notice-title"
      className="mt-8 overflow-hidden rounded-xl border border-amber-200/80 bg-white shadow-sm"
    >

      <div className="flex items-start gap-4 bg-gradient-to-br from-amber-50/80 to-[#fffaf7] p-5 sm:p-6">

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="payment-notice-title"
              className="text-[12px] md:text-[14px] font-semibold text-slate-700 sm:text-base"
            >
              Payment Confirmation Pending
            </h2>

            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100/70 px-2.5 py-1 text-[9px] md:text-[10px] uppercase tracking-wider text-amber-800">
              Pending
            </span>
          </div>

          <p className="mt-2 text-[12px] font-light sm:text-[13px] md:text-[13.5px] leading-relaxed tracking-wide mx-auto text-gray-600">
            Your order has been created, but payment has not been
            confirmed yet. Razorpay integration is currently not
            connected in this development/testing flow, so this
            order has not been marked as paid.
          </p>

          {/* Development Notice */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-white/80 p-3">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden="true"
            />

            <p className="text-xs leading-5 text-slate-500">
              This is a testing notice. Payment confirmation will
              require the payment gateway integration to be
              configured and verified.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessPaymentNotice;