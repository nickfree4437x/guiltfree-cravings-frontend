import { Link } from "react-router-dom";

function ReviewEmptyCart() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">

      <div className="text-center">

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

        <h1 className="mt-7 text-3xl font-bold text-slate-900 sm:text-4xl">
          Your Cart is Empty
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          There are no products available to
          review.
        </p>

        <Link
          to="/#products"
          className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Explore Products
        </Link>

      </div>

    </main>
  );
}

export default ReviewEmptyCart;