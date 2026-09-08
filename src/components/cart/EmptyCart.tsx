import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full text-center">
          {/* =================================================
              ICON
          ================================================== */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfd3] bg-[#f3e4d3] text-[#8b542f] sm:h-[72px] sm:w-[72px]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
              />
            </svg>
          </div>

          {/* =================================================
              HEADING
          ================================================== */}

          <h1 className="mt-4 text-[18px] md:text-[24px] font-semibold tracking-tight text-slate-900 sm:mt-5">
            Your Cart is Empty
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p className="mx-auto mt-3 max-w-md text-sm leading-5 font-[350] text-slate-500 sm:mt-4 sm:text-[15px] sm:leading-6">
            Looks like you haven't added anything to your cart
            yet. Explore our delicious homemade cravings and
            find something you love.
          </p>

          {/* =================================================
              CTA
          ================================================== */}

          <Link
            to="/#products"
            className="group mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#8b542f] px-6 text-sm text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 sm:mt-8"
          >
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default EmptyCart;