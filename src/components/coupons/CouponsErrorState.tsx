import {
  AlertCircle,
} from "lucide-react";

interface CouponsErrorStateProps {
  message: string;
}

function CouponsErrorState({
  message,
}: CouponsErrorStateProps) {
  return (
    <section
      role="alert"
      className="
        mt-7
        rounded-[28px]
        border
        border-[#F0D9D9]
        bg-white
        px-6
        py-12
        text-center
        shadow-[0_10px_35px_rgba(88,55,35,0.04)]
        sm:px-8
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
          bg-[#FFF3F3]
        "
      >
        <AlertCircle
          className="h-5 w-5 text-[#C86B6B]"
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
        Unable to load offers
      </h2>

      {/* Error */}
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
        {message}
      </p>
    </section>
  );
}

export default CouponsErrorState;