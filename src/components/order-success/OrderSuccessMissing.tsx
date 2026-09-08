import { Link } from "react-router-dom";

function OrderSuccessMissing() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6 py-16">
      <div className="w-full max-w-md text-center">

        {/* Icon */}

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
              d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900">
          Order Information Missing
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          We could not find the order information
          for this page. Please go back and review
          your order.
        </p>

        <Link
          to="/checkout/review"
          className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Back to Review
        </Link>

      </div>
    </main>
  );
}

export default OrderSuccessMissing;