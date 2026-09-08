function CheckoutHeader() {
  return (
    <div>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mt-12 text-center sm:mt-16">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-[12px] md:sm:text-[15px] font-[350] leading-6 text-slate-500">
          Enter your details and review your selected
          cravings before placing your order.
        </p>
      </div>
    </div>
  );
}

export default CheckoutHeader;