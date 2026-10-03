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

function CouponCard({
  coupon,
}: CouponCardProps) {
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
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        sm:p-6
      "
    >

      {/* =================================================
          COUPON TOP
      ================================================= */}

      <div className="relative flex items-start justify-between gap-4">

        {/* Discount Icon */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#FBEEF1]
            transition-colors
            duration-200
            group-hover:bg-[#F8E5EA]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="
              h-5
              w-5
              text-[#B5697A]
            "
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

        {/* Discount Badge */}

        <span
          className="
            rounded-full
            border
            border-[#F1DDE2]
            bg-[#FBEEF1]
            px-3
            py-1
            text-[9px]
            tracking-wide
            text-[#B5697A]
            sm:text-[10px]
          "
        >
          {coupon.discount}
        </span>
      </div>

      {/* =================================================
          TITLE
      ================================================= */}

      <h2
        className="
          relative
          mt-3
          text-[15px]
          font-semibold
          tracking-tight
          text-[#3E3430]
          sm:text-[17px]
        "
      >
        {coupon.title}
      </h2>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p
        className="
          relative
          mt-0
          text-[11.5px]
          leading-5
          text-[#8B7A6C]
          sm:text-[12px]
          sm:leading-6
        "
      >
        {coupon.description}
      </p>

      {/* =================================================
          COUPON CODE
      ================================================= */}

      <div
        className="
          relative
          mt-3
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-[#E2C4CC]
          bg-[#FFFCF7]
          p-1.5
          transition-colors
          duration-200
          group-hover:border-[#D9AAB5]
        "
      >
        {/* Code */}

        <div className="min-w-0 flex-1 px-2">
         

          <p
            className="
              mt-0
              truncate
              text-[13px]
              font-bold
              tracking-wider
              text-[#B5697A]
              sm:text-sm
            "
          >
            {coupon.code}
          </p>
        </div>

        {/* Copy Button */}

        <button
          type="button"
          onClick={handleCopy}
          className="
            shrink-0
            rounded-xl
            bg-[#B5697A]
            px-4
            py-2.5
            text-[11px]
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-[#A55F70]
            hover:shadow-md
            active:scale-[0.97]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#B5697A]/30
            focus-visible:ring-offset-2
          "
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* =================================================
          EXTRA DETAILS
      ================================================= */}

      {(coupon.minimumOrder ||
        coupon.expiry) && (
        <div
          className="
            relative
            mt-4
            flex
            flex-wrap
            gap-x-4
            gap-y-2
            text-[10px]
            leading-5
            text-[#A39890]
            sm:text-[11px]
          "
        >
          {coupon.minimumOrder && (
            <span>
              Minimum order:{" "}
              <strong
                className="
                  text-[#6F625A]
                "
              >
                {coupon.minimumOrder}
              </strong>
            </span>
          )}

          {coupon.expiry && (
            <span>
              Valid until:{" "}
              <strong
                className="
                  text-[#6F625A]
                "
              >
                {coupon.expiry}
              </strong>
            </span>
          )}
        </div>
      )}

      {/* =================================================
          BOTTOM ACCENT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[2px]
          w-0
          bg-[#B5697A]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </article>
  );
}

export default CouponCard;