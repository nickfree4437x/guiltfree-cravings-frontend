function OrderSuccessHeader() {
  return (
    <section className="rounded-3xl border border-[#eadfd3] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">

      {/* Success Icon */}

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-10 w-10 text-green-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 12 4 4L19 6"
          />
        </svg>
      </div>

      <span className="mt-7 inline-flex rounded-full bg-[#f3e4d3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b542f]">
        Order Created
      </span>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Your Order Has Been Created!
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
        Thank you for choosing GuiltFree Cravings.
        Your order has been successfully created
        and is currently awaiting payment confirmation.
      </p>

    </section>
  );
}

export default OrderSuccessHeader;