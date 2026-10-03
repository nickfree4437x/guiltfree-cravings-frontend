import {
  TicketPercent,
} from "lucide-react";

function CouponsEmptyState() {
  return (
    <section
      className="
        mt-5
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        px-6
        py-14
        text-center
        shadow-sm
        sm:px-8
      "
    >
      {/* Icon */}
      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-[#FBEEF1]
        "
      >
        <TicketPercent
          className="h-6 w-6 text-[#B5697A]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      {/* Heading */}
      <h2
        className="
          mt-5
          text-[18px]
          font-semibold
          tracking-tight
          text-[#3E3430]
        "
      >
        No offers available right now
      </h2>

      {/* Description */}
      <p
        className="
          mx-auto
          mt-2
          max-w-md
          text-[12px]
          leading-5
          text-gray-600
          sm:text-[13px]
          sm:leading-relaxed
        "
      >
        There are no active offers available
        for your account at the moment. Check
        back later for new savings.
      </p>

    </section>
  );
}

export default CouponsEmptyState;