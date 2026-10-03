function CouponsUsageInfo() {
  return (
    <section
      className="
        mt-5
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        p-5
        shadow-sm
        sm:p-7
      "
    >
      <div className="flex items-start gap-4">

        {/* =================================================
            ICON
        ================================================== */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-[#FBEEF1]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5 text-[#B5697A]"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7h.01"
            />
          </svg>
        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div>
          <h2
            className="
              text-[13px]
              font-semibold
              text-[#3E3430]
              sm:text-[14px]
            "
          >
            How to use a coupon
          </h2>

          <p
            className="
              mt-0
              text-[11px]
              leading-5
              text-[#8B7A6C]
              sm:text-[12px]
              sm:leading-6
            "
          >
            Copy your coupon code and apply it
            during checkout before completing
            your order.
          </p>
        </div>

      </div>
    </section>
  );
}

export default CouponsUsageInfo;