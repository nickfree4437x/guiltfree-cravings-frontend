import { useState } from "react";
import { ChevronDown } from "lucide-react";

function ProductPickerGuide() {
  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  const guideItems = [
    {
      desktopTitle:
        "Trying GuiltFree Cravings for the first time and wondering which laddoo and pack size would be the perfect place to start?",

      mobileTitle:
        "First time trying GuiltFree Cravings?",

      desktopDescription:
        "Start with the 250g pack and discover your favourite laddoo without committing to a larger quantity. It’s a simple way to explore our flavours and find the one you’ll want to order again.",

      mobileDescription:
        "Start with 250g. It’s the perfect size to try a flavour before choosing a larger pack.",
    },

    {
      desktopTitle:
        "Buying for the family, sharing with friends, or looking for a thoughtful laddoo option to gift someone special?",

      mobileTitle:
        "Buying for the family or to gift?",

      desktopDescription:
        "Go for the 500g pack when you’re sharing with family or friends. If you’re gifting, choose the glass jar for a more thoughtful and special presentation.",

      mobileDescription:
        "Go for 500g, or choose the glass jar when you want something a little more special.",
    },

    {
      desktopTitle:
        "Looking for something wholesome and satisfying that can keep you going when you need a more filling sweet?",

      mobileTitle:
        "Need something more filling?",

      desktopDescription:
        "Try Sattu or Dry Fruit Sattu Laddoo. They’re made for those moments when you want something wholesome, naturally satisfying, and delicious at the same time.",

      mobileDescription:
        "Try Sattu or Dry Fruit Sattu Laddoo for something wholesome and more satisfying.",
    },

    {
      desktopTitle:
        "Looking for a naturally sweet laddoo option without added refined sugar while still enjoying something delicious?",

      mobileTitle:
        "Looking for a sugar-free option?",

      desktopDescription:
        "Dates Delight is the one to pick. It’s made for those who want to enjoy a delicious laddoo while choosing an option without added refined sugar.",

      mobileDescription:
        "Dates Delight is the one. Naturally sweet and made without added refined sugar.",
    },

    {
      desktopTitle:
        "Not looking for anything specific and simply craving something sweet, comforting, and delicious right now?",

      mobileTitle:
        "Just craving something sweet?",

      desktopDescription:
        "Pick any flavour that catches your eye. That’s the whole idea — enjoy a comforting, homemade-style laddoo whenever the craving hits.",

      mobileDescription:
        "Pick any. That’s the whole idea.",
    },
  ];

  return (
    <div
      className="
        w-full
        lg:relative
        lg:left-1/2
        lg:w-[min(1100px,calc(100vw-80px))]
        lg:-translate-x-1/2
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-2">
        <h2
          className="
            text-[16px]
            font-semibold
            tracking-wide
            text-[#2c2c2c]
            sm:text-[18px]
          "
        >
          Not sure what to pick?
        </h2>

        <p
          className="
            mt-1
            text-[12px]
            leading-relaxed
            text-gray-600
            sm:text-[13px]
          "
        >
          A little help choosing the right
          laddoo, flavour, and pack size for you.
        </p>
      </div>

      {/* =====================================================
          GUIDE ACCORDION
      ===================================================== */}

      <div className="w-full space-y-3">
        {guideItems.map((item, index) => {
          const isOpen =
            openIndex === index;

          return (
            <div
              key={index}
              className={`
                w-full
                overflow-hidden
                rounded-lg
                border
                bg-white
                transition-all
                duration-300
                ${
                  isOpen
                    ? "border-[#B5697A]/40 shadow-sm"
                    : "border-gray-200 hover:border-[#B5697A]/30"
                }
              `}
            >
              {/* =================================================
                  QUESTION
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setOpenIndex(
                    isOpen ? null : index
                  )
                }
                aria-expanded={isOpen}
                className="
                  flex
                  w-full
                  items-center
                  gap-5
                  bg-white
                  px-5
                  py-[8px]
                  text-left
                  transition-colors
                  duration-300
                  hover:bg-[#fffbfc]
                  sm:px-6
                  sm:py-[14px]
                "
              >
                {/* =================================================
                    DESKTOP QUESTION
                ================================================= */}

                <span
                  className={`
                    hidden
                    min-w-0
                    flex-1
                    whitespace-nowrap
                    text-[13px]
                    leading-[1.5]
                    transition-colors
                    duration-200
                    lg:block
                    lg:text-[14px]
                    text-gray-700
                  `}
                >
                  {item.desktopTitle}
                </span>

                {/* =================================================
                    MOBILE QUESTION
                ================================================= */}

                <span
                  className={`
                    min-w-0
                    flex-1
                    pr-1
                    text-[11.5px]
                    leading-relaxed
                    transition-colors
                    duration-200
                    sm:text-[12px]
                    lg:hidden
                    text-gray-700
                  `}
                >
                  {item.mobileTitle}
                </span>

                {/* =================================================
                    CHEVRON
                ================================================= */}

                <span
                  className={`
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "bg-[#FBEEF1]"
                        : "bg-[#faf8f5]"
                    }
                  `}
                >
                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180 text-[#B5697A]"
                          : "text-[#AF956C]"
                      }
                    `}
                  />
                </span>
              </button>

              {/* =================================================
                  ANSWER
              ================================================= */}

              <div
                className={`
                  grid
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }
                `}
              >
                <div className="overflow-hidden">
                  <div
                    className="
                      border-t
                      px-5
                      pb-4
                      pt-3
                      sm:px-6
                      sm:pb-5
                      sm:pt-4
                    "
                  >
                    {/* =================================================
                        DESKTOP ANSWER
                    ================================================= */}

                    <p
                      className="
                        hidden
                        max-w-4xl
                        text-[12px]
                        leading-relaxed
                        text-gray-600
                        lg:block
                        lg:text-[13px]
                      "
                    >
                      {item.desktopDescription}
                    </p>

                    {/* =================================================
                        MOBILE ANSWER
                    ================================================= */}

                    <p
                      className="
                        text-[11px]
                        leading-relaxed
                        text-gray-600
                        sm:text-[12px]
                        lg:hidden
                      "
                    >
                      {item.mobileDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductPickerGuide;