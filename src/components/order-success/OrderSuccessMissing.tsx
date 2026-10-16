import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ClipboardList } from "lucide-react";

function OrderSuccessMissing() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-5 py-12 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-[#eadfd3] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        {/* Warning Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1f2] ring-8 ring-[#fff8f7]">
          <AlertTriangle
            className="h-9 w-9 text-[#B5697A]"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        {/* Heading */}
        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fff1f2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9f5668]">
          <ClipboardList className="h-3.5 w-3.5" />
          Order Details Unavailable
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Order Information Missing
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
          We couldn't find the order information for this page.
          Please return to your order review and check your details
          before continuing.
        </p>

        {/* Action */}
        <div className="mt-8">
          <Link
            to="/checkout/review"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#B5697A] px-6 py-3 text-sm text-white shadow-sm hover:bg-[#9F5668] hover:shadow-md focus:outline-none sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Review
          </Link>
        </div>

        {/* Supporting Note */}
        <p className="mt-4 text-xs leading-5 text-slate-400">
          Need help? Please revisit your checkout and try again.
        </p>
      </section>
    </main>
  );
}

export default OrderSuccessMissing;
