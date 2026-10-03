function OrdersLoadingState() {
  return (
    <section
      aria-live="polite"
      className="
        mx-auto
        mt-8
        max-w-5xl
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        px-6
        py-16
        text-center
        shadow-sm
        sm:py-20
      "
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBEEF1]">
        <div
          className="
            h-5
            w-5
            animate-spin
            rounded-full
            border-2
            border-[#E8D8DC]
            border-t-[#B5697A]
          "
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-5 text-[15px] font-semibold text-[#3E3430]">
        Loading your orders
      </h2>

      <p className="mx-auto mt-2 max-w-md text-[11.5px] leading-5 text-[#8B7A6C] sm:text-[13px]">
        We're getting your latest order information.
      </p>
    </section>
  );
}

export default OrdersLoadingState;