import { Link } from "react-router-dom";

function CheckoutEmptyCart() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
        <div className="w-full text-center">

          {/* =================================================
              ICON
          ================================================= */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4d3]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-9 w-9 text-[#8b542f]"
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
          ================================================= */}

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your Cart is Empty
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
            Add some delicious cravings to your
            cart before proceeding to checkout.
          </p>

          {/* =================================================
              CTA
          ================================================= */}

          <Link
            to="/#products"
            className="mt-8 inline-flex rounded-full bg-[#8b542f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Explore Products
          </Link>

        </div>
      </div>
    </main>
  );
}

export default CheckoutEmptyCart;