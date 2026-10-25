import { useState } from "react";

// ─── Types ────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────
function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy coupon:", error);
    }
  };

  const hasDetails = Boolean(coupon.minimumOrder || coupon.expiry);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm transition-all duration-300 sm:p-6">
      {/* Coupon top */}
      <div className="relative flex items-start justify-between gap-4">
        {/* Discount icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FBEEF1]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 text-[#B5697A]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 12.5V7a2 2 0 0 0-2-2h-5.5L4 13.5 10.5 20 20 10.5v2Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5h.01" />
          </svg>
        </div>

        {/* Discount badge */}
        <span className="rounded-full border border-[#F1DDE2] bg-[#FBEEF1] px-3 py-1 text-[9px] tracking-wide text-[#B5697A] sm:text-[10px]">
          {coupon.discount}
        </span>
      </div>

      {/* Title */}
      <h2 className="relative mt-2 text-[14px] font-semibold tracking-tight text-gray-600 sm:text-[16px]">
        {coupon.title}
      </h2>

      {/* Description */}
      <p className="relative mt-0 text-[11.5px] leading-relaxed text-slate-500 sm:text-[12px] sm:leading-relaxed">
        {coupon.description}
      </p>

      {/* Coupon code */}
      <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-[#E2C4CC] bg-[#fffbfc] p-1 transition-colors duration-200 group-hover:border-[#D9AAB5]">
        <div className="min-w-0 flex-1 px-2">
          <p className="mt-0 truncate text-[12px] font-bold tracking-wider text-[#B5697A] sm:text-[13px]">
            {coupon.code}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-xl bg-[#B5697A] px-4 py-2 text-[11px] text-white shadow-sm transition-all duration-200 hover:bg-[#A55F70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/30 focus-visible:ring-offset-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Extra details */}
      {hasDetails && (
        <div className="relative mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
          {coupon.minimumOrder && (
            <span>
              Minimum order: <strong className="text-gray-600">{coupon.minimumOrder}</strong>
            </span>
          )}
          {coupon.expiry && (
            <span>
              Valid until: <strong className="text-gray-600">{coupon.expiry}</strong>
            </span>
          )}
        </div>
      )}

      {/* Bottom accent */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-[#B5697A] transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

export default CouponCard;