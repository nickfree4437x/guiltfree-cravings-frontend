function OrderSuccessHeader() {
  return (
    <section
      aria-labelledby="order-success-title"
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#F0E2E5]
        bg-white
        px-5
        py-8
        text-center
        shadow-sm
        sm:rounded-3xl
        sm:px-10
        sm:py-12
        lg:px-14
        lg:py-14
        md:mt-20
        mt-16
      "
    >
      {/* Subtle decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-44
          w-44
          rounded-full
          bg-[#F8E8EC]/50
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-16
          h-48
          w-48
          rounded-full
          bg-[#F7F1EA]/70
          blur-3xl
        "
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        {/* Success Icon */}
        <div
          className="
            flex
            h-[76px]
            w-[76px]
            items-center
            justify-center
            rounded-full
            border
            border-emerald-100
            bg-emerald-50
            shadow-sm
            sm:h-[80px]
            sm:w-[80px]
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-emerald-100
              sm:h-12
              sm:w-12
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-emerald-700 sm:h-9 sm:w-9"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#EED7DD]
            bg-[#FCF5F7]
            px-3.5
            py-2
            text-[10px]
            uppercase
            tracking-[0.16em]
            text-[#A45E70]
            sm:mt-5
            sm:px-4
            sm:text-[11px]
          "
        >
          Order Created
        </span>

        {/* Heading */}
        <h1
          id="order-success-title"
          className="
            mt-3
            text-[16px]
            font-semibold
            leading-tight
            tracking-[-0.035em]
            text-[#2C2C2C]
            sm:mt-5
            sm:text-[24px]
          "
        >
          Your Order Has Been Created!
        </h1>

        {/* Description */}
        <p
          className="
            text-[12px] mt-2 sm:text-[13.5px] md:text-[13.5px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-600
          "
        >
          Thank you for choosing GuiltFree Cravings. Your order
          has been created successfully and is awaiting payment
          confirmation.
        </p>

        {/* Payment Status Information */}
        <div
          className="
            mt-6
            flex
            w-full
            max-w-lg
            items-start
            gap-3
            rounded-xl
            border
            border-[#F0E2E5]
            bg-[#FCF9F7]
            px-4
            py-4
            text-left
            sm:mt-7
            sm:px-5
          "
        >
          <div
            className="
              mt-0.5
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F3E4D3]
              text-[#8B542F]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm font-semibold text-[#493B35]">
              Payment confirmation pending
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#82746D] sm:text-[12px]">
              Your payment status will be updated once the
              payment process is confirmed.
            </p>
          </div>
        </div>

        {/* Closing Note */}
        <p className="mt-4 text-[9.5px] sm:text-[13.5px] md:text-[13px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-600">
          We appreciate your order. Thank you for shopping with us!
        </p>
      </div>
    </section>
  );
}

export default OrderSuccessHeader;