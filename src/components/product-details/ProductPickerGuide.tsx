import { useState } from "react";

function ProductPickerGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-labelledby="product-picker-guide-title"
      className="mt-4"
    >
      {/* ===================================================
          Accordion Header
      =================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="product-picker-guide-content"
        className="group flex w-full items-center justify-between gap-4 text-left focus:outline-none"
      >
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
            A Little Help Choosing
          </span>

          <h3
            id="product-picker-guide-title"
            className="mt-0 text-lg font-bold tracking-tight text-slate-900"
          >
            Which one should I pick?
          </h3>
        </div>

        {/* Arrow */}
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-slate-500 transition-all duration-300 ${
            isOpen
              ? "rotate-180 border-[#8b542f] text-[#8b542f]"
              : "group-hover:border-[#c9aa91] group-hover:text-[#8b542f]"
          }`}
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* ===================================================
          Accordion Content
      =================================================== */}
      <div
        id="product-picker-guide-content"
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-4 divide-y divide-[#eadfd3] border-t border-[#eadfd3]">
            
            <div className="py-4">
              <p className="text-[12px] md:text-[13px] font-semibold text-slate-900">
                First time here?
              </p>

              <p className="mt-1 text-[12px] md:text-[14px] leading-6 text-slate-600">
                250g. Fall in love before
                you commit.
              </p>
            </div>

            <div className="py-4">
              <p className="text-[12px] md:text-[14px] font-semibold text-slate-900">
                Buying for the family,
                or to gift?
              </p>

              <p className="mt-1 text-[12px] md:text-[14px] leading-6 text-slate-600">
                500g, or the glass jar if
                you want it to feel special.
              </p>
            </div>

            <div className="py-4">
              <p className="text-[12px] md:text-[14px] font-semibold text-slate-900">
                Need something that
                actually fuels you?
              </p>

              <p className="mt-1 text-[12px] md:text-[14px] leading-6 text-slate-600">
                Sattu or Dry Fruit Sattu
                Laddoo.
              </p>
            </div>

            <div className="py-4">
              <p className="text-[12px] md:text-[14px] font-semibold text-slate-900">
                Sugar-free, not just
                sugar-lite?
              </p>

              <p className="mt-1 text-[12px] md:text-[14px] leading-6 text-slate-600">
                Dates Delight is the one.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-[12px] md:text-[14px] font-semibold text-slate-900">
                Just craving something
                sweet, no reason needed?
              </p>

              <p className="mt-1 text-[12px] md:text-[14px] leading-6 text-slate-600">
                Pick any. That's the whole
                idea.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPickerGuide;