import { useState } from "react";

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  discount: string;
  minimumOrder?: string;
  expiry?: string;
}

interface CouponCardProps {
  coupon: Coupon;
}

function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        coupon.code
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy coupon:",
        error
      );
    }
  };

  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

      {/* =================================================
          COUPON TOP
      ================================================= */}

      <div className="flex items-start justify-between gap-4">

        {/* Discount */}

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f3e4d3]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-7 w-7 text-[#8b542f]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 12.5V7a2 2 0 0 0-2-2h-5.5L4 13.5 10.5 20 20 10.5v2Z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.5 8.5h.01"
            />
          </svg>
        </div>

        {/* Discount Text */}

        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
          {coupon.discount}
        </span>

      </div>

      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        {coupon.title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {coupon.description}
      </p>

      {/* =================================================
          COUPON CODE
      ================================================= */}

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed border-[#c9a98d] bg-[#fffaf5] p-2">

        <div className="min-w-0 flex-1 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Coupon Code
          </p>

          <p className="mt-0.5 truncate text-sm font-bold tracking-wider text-[#8b542f]">
            {coupon.code}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-xl bg-[#8b542f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

      </div>

      {/* =================================================
          EXTRA DETAILS
      ================================================= */}

      {(coupon.minimumOrder ||
        coupon.expiry) && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">

          {coupon.minimumOrder && (
            <span>
              Minimum order:{" "}
              <strong className="font-semibold text-slate-500">
                {coupon.minimumOrder}
              </strong>
            </span>
          )}

          {coupon.expiry && (
            <span>
              Valid until:{" "}
              <strong className="font-semibold text-slate-500">
                {coupon.expiry}
              </strong>
            </span>
          )}

        </div>
      )}

    </article>
  );
}

export default CouponCard;