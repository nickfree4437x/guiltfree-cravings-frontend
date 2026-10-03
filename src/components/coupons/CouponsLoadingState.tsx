import {
  Loader2,
} from "lucide-react";

function CouponsLoadingState() {
  return (
    <section
      aria-live="polite"
      className="
        mt-7
        rounded-[28px]
        border
        border-[#EFE3D2]
        bg-white
        px-6
        py-16
        text-center
        shadow-[0_10px_35px_rgba(88,55,35,0.04)]
      "
    >
      {/* Icon */}
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-[#FBEEF1]
        "
      >
        <Loader2
          className="
            h-5
            w-5
            animate-spin
            text-[#B5697A]
          "
          aria-hidden="true"
        />
      </div>

      {/* Heading */}
      <h2
        className="
          mt-5
          text-[15px]
          font-semibold
          text-[#3E3430]
        "
      >
        Loading your offers
      </h2>

      {/* Description */}
      <p
        className="
          mx-auto
          mt-2
          max-w-md
          text-[12px]
          leading-5
          text-[#8B7A6C]
          sm:text-[13px]
        "
      >
        We're checking the latest offers
        available for you.
      </p>
    </section>
  );
}

export default CouponsLoadingState;