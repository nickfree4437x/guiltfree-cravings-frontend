import { Link } from "react-router-dom";

function OrdersEmptyState() {
  return (
    <section
      className="
        mx-auto
        mt-8
        max-w-3xl
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        px-6
        py-14
        text-center
        shadow-sm
        sm:px-10
        sm:py-16
      "
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FBEEF1]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-7 w-7 text-[#B5697A]"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-[20px] font-semibold tracking-tight text-[#3E3430] sm:text-[22px]">
        No Orders Yet
      </h2>

      <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-5 text-[#8B7A6C] sm:text-[13px] sm:leading-6">
        You haven't placed any orders yet. Explore
        our homemade treats and find something
        you'd love to enjoy.
      </p>

      <Link
        to="/#products"
        className="
          mt-7
          inline-flex
          items-center
          justify-center
          rounded-full
          bg-[#B5697A]
          px-6
          py-2.5
          text-[11px]
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-[#A55F70]
          hover:shadow-md
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B5697A]/30
          focus-visible:ring-offset-2
          sm:px-7
          sm:text-[12px]
        "
      >
        Start Shopping
      </Link>
    </section>
  );
}

export default OrdersEmptyState;