function CheckoutHeader() {
  return (
    <div>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mt-16 text-center sm:mt-20">
        <h1 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap">
          Checkout
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-[12px] md:sm:text-[15px] leading-relaxed text-slate-600">
          Enter your details and review your selected
          cravings before placing your order.
        </p>
      </div>
    </div>
  );
}

export default CheckoutHeader;