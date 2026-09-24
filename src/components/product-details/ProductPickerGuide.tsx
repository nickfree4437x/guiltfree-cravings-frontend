import { useState } from "react";
import { ChevronDown } from "lucide-react";

function ProductPickerGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-[#EFE3D2] pt-5">
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          text-left
          transition-colors
          hover:text-[#B5697A]
        "
      >
        <span
          className="
            text-xs
            font-medium
            text-[#1F4A2E]
          "
        >
          Not sure what to pick?
        </span>

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`
            shrink-0
            text-[#B5697A]
            transition-transform
            duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Guide */}
      <div
        className={`
          grid
          transition-all
          duration-300
          ease-in-out
          ${
            isOpen
              ? "mt-4 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              rounded-xl
              border border-[#EFE3D2]
              bg-[#FFFCF7]
              p-4
              sm:p-5
            "
          >
            <div className="space-y-4">
              {/* First time */}
              <div>
                <p className="text-xs font-medium leading-5 text-[#1F4A2E]">
                  First time here?
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8B7A6C]">
                  250g. Fall in love before you commit.
                </p>
              </div>

              {/* Family / Gift */}
              <div>
                <p className="text-xs font-medium leading-5 text-[#1F4A2E]">
                  Buying for the family, or to gift?
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8B7A6C]">
                  500g, or the glass jar if you want it to feel
                  special.
                </p>
              </div>

              {/* Fuel */}
              <div>
                <p className="text-xs font-medium leading-5 text-[#1F4A2E]">
                  Need something that actually fuels you?
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8B7A6C]">
                  Sattu or Dry Fruit Sattu Laddoo.
                </p>
              </div>

              {/* Dates Delight */}
              <div>
                <p className="text-xs font-medium leading-5 text-[#1F4A2E]">
                  Sugar-free, not just sugar-lite?
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8B7A6C]">
                  Dates Delight is the one.
                </p>
              </div>

              {/* Any craving */}
              <div>
                <p className="text-xs font-medium leading-5 text-[#1F4A2E]">
                  Just craving something sweet, no reason needed?
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8B7A6C]">
                  Pick any. That&apos;s the whole idea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPickerGuide;