interface OrdersErrorStateProps {
  message: string;
  onRetry: () => void;
}

function OrdersErrorState({
  message,
  onRetry,
}: OrdersErrorStateProps) {
  return (
    <section
      role="alert"
      className="
        mx-auto
        mt-8
        max-w-3xl
        rounded-xl
        border
        border-[#F0D9D9]
        bg-white
        px-6
        py-12
        text-center
        shadow-sm
        sm:px-10
      "
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3F3]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6 text-[#C86B6B]"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
          />
        </svg>
      </div>

      <h2 className="mt-5 text-[18px] font-semibold tracking-tight text-[#3E3430] sm:text-[20px]">
        Something went wrong
      </h2>

      <p className="mx-auto mt-2 max-w-md text-[11.5px] leading-5 text-[#8B7A6C] sm:text-[13px] sm:leading-6">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-6
          inline-flex
          items-center
          justify-center
          rounded-full
          bg-[#B5697A]
          px-6
          py-2.5
          text-[11px]
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-[#A55F70]
          hover:shadow-md
          active:scale-[0.98]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B5697A]/30
          focus-visible:ring-offset-2
          sm:text-[12px]
        "
      >
        Try Again
      </button>
    </section>
  );
}

export default OrdersErrorState;