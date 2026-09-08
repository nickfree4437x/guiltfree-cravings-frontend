import { Link } from "react-router-dom";

function ReviewMissingCustomer() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">

      <div className="text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4d3]">

          <span className="text-2xl font-bold text-[#8b542f]">
            !
          </span>

        </div>

        <h1 className="mt-7 text-3xl font-bold text-slate-900 sm:text-4xl">
          Checkout Information Missing
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Please complete your checkout information
          before reviewing your order.
        </p>

        <Link
          to="/checkout"
          className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Back to Checkout
        </Link>

      </div>

    </main>
  );
}

export default ReviewMissingCustomer;