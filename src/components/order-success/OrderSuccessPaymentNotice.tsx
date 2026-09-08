function OrderSuccessPaymentNotice() {
  return (
    <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">

      <div className="flex items-start gap-3">

        <div
          className="mt-0.5 shrink-0 text-amber-600"
          aria-hidden="true"
        >
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
  );
}

export default OrderSuccessPaymentNotice;