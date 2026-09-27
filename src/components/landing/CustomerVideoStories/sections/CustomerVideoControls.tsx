import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomerVideoControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

function CustomerVideoControls({
  onPrevious,
  onNext,
}: CustomerVideoControlsProps) {
  return (
    <div
      className="
        mt-5
        flex
        items-center
        justify-center
        gap-2
        sm:mt-6
      "
    >
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous customer story"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-[#EADBD0]
          bg-white
          text-[#6F6259]
          transition-all
          duration-300
          hover:border-[#B5697A]
          hover:text-[#B5697A]
        "
      >
        <ChevronLeft
          className="h-4 w-4"
          strokeWidth={2}
        />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next customer story"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-[#EADBD0]
          bg-white
          text-[#6F6259]
          transition-all
          duration-300
          hover:border-[#B5697A]
          hover:text-[#B5697A]
        "
      >
        <ChevronRight
          className="h-4 w-4"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

export default CustomerVideoControls;