function CartHeader() {
  return (
    <div className="mb-8 sm:mt-14">
      {/* =====================================================
          CONTINUE SHOPPING
      ====================================================== */}

      {/* <Link
        to="/"
        className="group inline-flex items-center gap-2 px-3.5 py-2 hover:underline text-sm text-slate-600 shadow-[0_2px_8px_rgba(117,69,39,0.04)] transition-all duration-200"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8eee4] text-[#8b542f] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:bg-[#f3e4d3]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </span>

        Continue Shopping
      </Link> */}

      {/* =====================================================
          HEADER CONTENT
      ====================================================== */}

      <div className="mt-6 text-center sm:mt-7">
        <h1 className="mt-2 text-[18px] md:text-[28px] font-bold tracking-tight text-slate-900">
          Your Cart
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-[12px] md:text-[15px] font-[350] leading-5 text-slate-500">
          Take a moment to review your carefully chosen treats before moving ahead with your order.
        </p>
      </div>
    </div>
  );
}

export default CartHeader;