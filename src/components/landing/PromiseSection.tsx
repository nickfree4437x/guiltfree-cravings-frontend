import {
  Leaf,
  ShieldCheck,
  Heart,
  Droplets,
  HandHeart,
} from "lucide-react";

function OurPromise() {
  const promises = [
    {
      number: "01",
      icon: Leaf,
      title: "No Refined Sugar",
      description:
        "We sweeten our laddoos with jaggery or dates never refined sugar.",
    },
    {
      number: "02",
      icon: Droplets,
      title: "No Refined Oils",
      description:
        "Desi ghee is the only fat we use in our laddoos no palm oil or refined oils.",
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: "No Preservatives",
      description:
        "Made in small batches, with freshness in mind not a long shelf life.",
    },
    {
      number: "04",
      icon: HandHeart,
      title: "Made in Small Batches",
      description:
        "Every laddoo is hand-rolled with care, made in small batches and packed fresh.",
    },
  ];

  const trustBadges = [
    { icon: Leaf, label: "100% Natural" },
    { icon: Heart, label: "Made with Love" },
    { icon: Droplets, label: "No Palm Oil" },
    { icon: ShieldCheck, label: "No Refined Oil" },
  ];

  return (
    <section
      id="our-promise"
      className="relative overflow-hidden bg-white py-8 md:py-12"
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

      <div className="relative mx-auto w-full max-w-[1360px] px-6 sm:px-10 md:px-14 lg:px-20">

        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Heading */}
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap">
            Our Promise, Made with Care
            
          </h2>

          {/* Description */}
          <p className="mt-0 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
            We believe you shouldn't have to read the fine print to know
            what's going into something you eat.{" "}
            <span className=" text-[#B5697A]">
              No shortcuts.
            </span>
          </p>
        </div>

        {/* =========================================================
            PROMISES — 2x2 grid with editorial cards
        ========================================================= */}
        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:gap-7">
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

                  {/* Icon + Number row */}
                  <div className="flex items-center justify-between">
                    {/* Icon */}
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

                  {/* Title */}
                  <h3 className="mt-6 text-[18px] font-semibold leading-[1.2] text-[#1F4A2E] sm:text-[20px] lg:text-[22px]">
                    {promise.title}
                  </h3>

                  {/* Accent underline */}
                  <span className="mt-3 block h-[2px] w-10 rounded-full bg-[#B5697A]/60 transition-all duration-500 group-hover:w-20 group-hover:bg-[#B5697A]" />

                  {/* Description */}
                  <p className="text-gray-800 text-[11px] mt-3 sm:text-[13px] md:text-[13px] tracking-wide leading-relaxed max-w-[320px] sm:max-w-[600px] mx-auto">
                    {promise.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            BOTTOM TRUST BAR
        ========================================================= */}
        <div
          className="
            relative mt-6 overflow-hidden rounded-xl
            border border-[#EFE3D2] bg-white/60
            px-5 py-5 backdrop-blur-sm sm:mt-10 sm:px-8 sm:py-6
          "
        >
          {/* Corner accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FBEEF1]/60 blur-[50px]"
          />

          <div className="relative grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="group/badge flex items-center justify-center gap-2.5 sm:gap-3"
                >
                  <span
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-full bg-[#FBEEF1]
                      transition-all duration-300
                      sm:h-10 sm:w-10
                    "
                  >
                    <Icon
                      className="h-4 w-4 text-[#B5697A] sm:h-[18px] sm:w-[18px]"
                      strokeWidth={2}
                    />
                  </span>

                  <span className="text-[11px] tracking-wide text-[#5A4A3F] sm:text-[12.5px]">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default OurPromise;