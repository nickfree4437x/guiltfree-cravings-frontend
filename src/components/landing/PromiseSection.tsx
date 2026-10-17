import {
  Leaf,
  ShieldCheck,
  Droplets,
  HandHeart,
  Sprout,
} from "lucide-react";

function OurPromise() {
  const promises = [
    {
      number: "01",
      icon: Leaf,
      title: "No Refined Sugar",
      description:
        "We sweeten our laddoos with jaggery or dates - never refined sugar.",
    },
    {
      number: "02",
      icon: Droplets,
      title: "No Palm Oil. No Refined Oils.",
      description:
        "Desi ghee is the only fat we use in our laddoos - no palm oil or refined cooking oils.",
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: "No Preservatives",
      description:
        "No artificial additives, no hidden ingredients. Just pure, honest food you can trust.",
    },
    {
      number: "04",
      icon: HandHeart,
      title: "Made in Small Batches",
      description:
        "Every laddoo is prepared with care, rolled by hand and packed fresh - because we would rather make less and make it well.",
    },
  ];

  // 5th Card (Full Width)
  const fullWidthPromise = {
    number: "05",
    icon: Sprout,
    title: "Real Ingredients",
    description:
      "Sattu, besan, dry fruits, seeds, makhana, desi ghee, jaggery and dates. Ingredients you can recognise. Ingredients we are proud to name.",
  };

  return (
    <section
      id="our-promise"
      className="relative overflow-hidden bg-white -mt-4 -md:mt-4 scroll-mt-20"
    >
      {/* Dotted pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #E8D9C4 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 sm:px-10 md:px-14 lg:px-20">

        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-1 leading-snug md:whitespace-nowrap">
            Our Promise, Made with Care
          </h2>

          <p className="mt-0 text-[12.5px] sm:text-[13.5px] md:text-[14px] font-[350] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
            Simple ingredients. Honest recipes. Nothing unnecessary.
          </p>
        </div>

        {/* =========================================================
            MOBILE VIEW — Compact Horizontal Cards
            (sirf mobile pe dikhega, sm se upar hide)
        ========================================================= */}
        <div className="mt-5 space-y-3 sm:hidden">
          {[...promises, fullWidthPromise].map((promise) => {
            const Icon = promise.icon;

            return (
              <div
                key={promise.number}
                className="
                  group relative flex items-start gap-4
                  overflow-hidden rounded-xl
                  border border-[#EFE3D2] bg-white
                  p-4 shadow-sm
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-xl bg-[#FBEEF1]
                  "
                >
                  <Icon
                    className="h-5 w-5 text-[#B5697A]"
                    strokeWidth={1.9}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-[#B5697A]/70">
                      {promise.number}
                    </span>
                    <span className="h-px w-4 bg-[#EFE3D2]" />
                  </div>

                  <h3 className="mt-1 text-[14px] font-semibold leading-tight text-[#1F4A2E]">
                    {promise.title}
                  </h3>

                  <p className="mt-1 text-[11.5px] leading-[1.55] tracking-wide text-slate-600">
                    {promise.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            DESKTOP VIEW — 2x2 Grid + Full Width 5th Card
            (mobile pe hide, sm se upar dikhe)
        ========================================================= */}
        <div className="mt-8 hidden gap-5 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:gap-7">
          {promises.map((promise) => {
            const Icon = promise.icon;

            return (
              <div
                key={promise.number}
                className="
                  group relative overflow-hidden rounded-lg
                  border border-[#EFE3D2] bg-white
                  p-6 shadow-sm
                  sm:p-7 lg:p-8
                "
              >
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-xl bg-[#FBEEF1]
                        sm:h-14 sm:w-14
                      "
                    >
                      <Icon
                        className="h-5 w-5 text-[#B5697A] sm:h-6 sm:w-6"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  <h3 className="mt-6 text-[18px] font-semibold leading-[1.2] text-gray-700 sm:text-[20px] lg:text-[22px]">
                    {promise.title}
                  </h3>

                  <span className="mt-3 block h-[2px] w-10 rounded-full bg-[#B5697A]/60 transition-all duration-500 group-hover:w-20 group-hover:bg-[#B5697A]" />

                  <p className="text-gray-600 text-[11px] mt-3 sm:text-[13px] md:text-[13px] tracking-wide leading-relaxed max-w-[320px] sm:max-w-[600px] mx-auto">
                    {promise.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* =========================================================
              FULL WIDTH 5TH CARD (Desktop Only)
          ========================================================= */}
          <div className="sm:col-span-2">
            <div
              className="
                group relative overflow-hidden rounded-lg
                border border-[#EFE3D2] bg-white
                p-6 shadow-sm
                sm:p-7 lg:p-8
              "
            >
              <div className="relative flex flex-col sm:flex-row sm:items-start sm:gap-6">
                {/* Icon */}
                <div
                  className="
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl bg-[#FBEEF1]
                    sm:h-14 sm:w-14
                  "
                >
                  <Sprout
                    className="h-5 w-5 text-[#B5697A] sm:h-6 sm:w-6"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Content */}
                <div className="mt-4 sm:mt-0 sm:flex-1">
                  <h3 className="text-[18px] font-semibold leading-[1.2] text-gray-700 sm:text-[20px] lg:text-[22px]">
                    {fullWidthPromise.title}
                  </h3>

                  <span className="mt-3 block h-[2px] w-10 rounded-full bg-[#B5697A]/60 transition-all duration-500 group-hover:w-20 group-hover:bg-[#B5697A]" />

                  <p className="text-gray-600 text-[11px] mt-3 sm:text-[13px] md:text-[13px] tracking-wide leading-relaxed max-w-[320px] sm:max-w-none sm:mx-0">
                    {fullWidthPromise.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default OurPromise;