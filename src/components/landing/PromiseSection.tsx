import {
  Leaf,
  ShieldCheck,
  Sparkles,
  Heart,
  Truck,
  Award,
} from "lucide-react";

function OurPromise() {
  const promises = [
    {
      number: "01",
      icon: Leaf,
      title: "No Refined Sugar",
      description:
        "Only jaggery and dates do the sweetening here pure, natural, and guilt-free.",
    },
    {
      number: "02",
      icon: ShieldCheck,
      title: "No Preservatives",
      description:
        "Small batches, made to be eaten fresh, not stored forever. Real food, real simple.",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Thoughtfully Sourced",
      description:
        "Real ghee, real nuts, nothing borrowed from a lab. Just honest, wholesome ingredients.",
    },
  ];

  const trustBadges = [
    { icon: Leaf, label: "100% Natural" },
    { icon: Heart, label: "Made with Love" },
    { icon: Truck, label: "Freshly Baked" },
    { icon: Award, label: "Trusted Brand" },
  ];

  return (
    <section
      id="our-promise"
      className="relative overflow-hidden bg-white py-8 md:py-10"
    >
      {/* ================= DECORATIVE BACKGROUND ================= */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F5E6D8]/50 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#FBEEF1]/60 blur-[110px]" />

      {/* Dotted pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
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
          <p className="mt-4 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
            We believe you shouldn't have to read the fine print to know
            what's going into something you eat.{" "}
            <span className=" text-[#B5697A]">
              No shortcuts.
            </span>
          </p>
        </div>

        {/* =========================================================
            PROMISE TIMELINE — Editorial numbered design
        ========================================================= */}
        <div className="relative mt-6 sm:mt-8 lg:mt-12">
          {/* Horizontal connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[54px] hidden h-px bg-gradient-to-r from-transparent via-[#E8D9C4] to-transparent md:block"
          />

          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {promises.map((promise) => {
              const Icon = promise.icon;

              return (
                <div
                  key={promise.number}
                  className="group relative"
                >
                  {/* ============ TOP: Number + Circle ============ */}
                  <div className="relative flex items-center gap-4 md:flex-col md:items-start">

                    {/* Circle with icon */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#EFE3D2] transition-all duration-500 md:mx-auto md:h-16 md:w-16">
                      <Icon
                        className="h-6 w-6 text-[#B5697A] transition-transform duration-500 md:h-7 md:w-7"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Big number (editorial) */}
                    <div className="md:mt-6 md:text-center md:w-full">
                      <span
                        className="
                          block font-serif text-[44px] font-light leading-none
                          text-[#B5697A]/40
                          transition-colors duration-500
                          group-hover:text-[#B5697A]
                          sm:text-[45px] md:text-[56px]
                        "
                      >
                        {promise.number}
                      </span>
                    </div>
                  </div>

                  {/* ============ Divider ============ */}
                  {/* <span
                    className="
                      mt-4 block h-px w-12 bg-[#B5697A]/50
                      transition-all duration-500
                      group-hover:w-24 group-hover:bg-[#B5697A]
                      md:mx-auto
                    "
                  /> */}

                  {/* ============ Title ============ */}
                  <h3
                    className="
                      mt-4 text-[18px] font-semibold leading-tight
                      text-[#1F4A2E]
                      transition-colors duration-300
                      sm:text-[20px] md:mt-5 md:text-center md:text-[22px]
                    "
                  >
                    {promise.title}
                  </h3>

                  {/* ============ Description ============ */}
                  <p
                    className="
                      mt-3 max-w-xs text-[13px] leading-[1.5] text-[#7A6A5C]
                      sm:text-[13.5px] md:mx-auto md:text-center md:text-[14px]
                    "
                  >
                    {promise.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            BOTTOM TRUST BAR
        ========================================================= */}
        <div
          className="
            mt-14 sm:mt-16
            rounded-xl border border-[#EFE3D2] bg-white/60
            px-5 py-5 backdrop-blur-sm sm:px-8 sm:py-6
          "
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="flex items-center justify-center gap-2.5 sm:gap-3"
                >
                  <span
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-full bg-[#FBEEF1]
                      transition-all duration-300
                      hover:scale-110 hover:bg-[#B5697A]/15
                      sm:h-10 sm:w-10
                    "
                  >
                    <Icon
                      className="h-4 w-4 text-[#B5697A] sm:h-[18px] sm:w-[18px]"
                      strokeWidth={2}
                    />
                  </span>

                  <span
                    className="
                      text-[11px] tracking-wide text-[#5A4A3F]
                      sm:text-[12.5px]
                    "
                  >
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