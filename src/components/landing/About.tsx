import {
  House,
  Leaf,
  ShieldCheck,
  Droplet,
  BriefcaseBusiness,
  Coffee,
  Users,
} from "lucide-react";

function About() {
  const features = [
    {
      icon: House,
      title: "Made at Home",
      description:
        "Hand-rolled in small batches with genuine care, comfort, and attention to detail.",
      color: "#C9788B",
      bg: "#FBEEF1",
    },
    {
      icon: Leaf,
      title: "No Refined Sugar",
      description:
        "Sweetened naturally with raw jaggery and dates instead of refined sugar.",
      color: "#5A8A5C",
      bg: "#EDF5ED",
    },
    {
      icon: ShieldCheck,
      title: "No Preservatives",
      description:
        "Freshly made without artificial preservatives or unnecessary additives.",
      color: "#B58A3D",
      bg: "#FAF3E3",
    },
    {
      icon: Droplet,
      title: "No Palm Oil",
      description:
        "Made with authentic Desi Ghee and without palm oil or hydrogenated fats.",
      color: "#4A7A8A",
      bg: "#EAF2F5",
    },
  ];

  const goodnessCards = [
    {
      icon: Users,
      title: "For Growing Kids",
      description:
        "A wholesome burst of natural energy for growing minds and active days.",
    },
    {
      icon: BriefcaseBusiness,
      title: "For Busy Women",
      description:
        "A nourishing little break when the day gets long, busy, and demanding.",
    },
    {
      icon: Coffee,
      title: "For Busy Men",
      description:
        "A wholesome bite between meetings, workouts, and everyday moments.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-8 md:py-12"
    >
      {/* ================= DECORATIVE BACKGROUND ================= */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F5E6D8]/50 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-40 h-80 w-80 rounded-full bg-[#FBEEF1]/60 blur-[110px]" />

      {/* ================= CONTENT WRAPPER — MORE SIDE GAP ================= */}
      <div className="relative mx-auto w-full max-w-[1360px] px-6 sm:px-10 md:px-14 lg:px-20">

        {/* =========================================================
            ABOUT INTRO
        ========================================================= */}
        <div className="mx-auto max-w-3xl text-center">


          {/* Heading */}
          <h2 className="font-serif anim-fadeUp delay-2 font-display text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide mb-2 leading-snug md:whitespace-nowrap text-[#C9788B]">
            About GuiltFree{" "}
            Tradition, Made Better.
          </h2>

          {/* Divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-2.5">
            <span className="h-px w-10 bg-[#C9788B]/40 sm:w-12" />
            <span className="h-px w-2 bg-[#C9788B]/60" />
            <span className="relative flex items-center justify-center">
              <span className="absolute h-3 w-3 rotate-45 rounded-[2px] bg-[#E7B5C1]/20" />
              <span className="relative h-2 w-2 rotate-45 rounded-[1.5px] border border-[#C9788B]/80 bg-[#E7B5C1]/40" />
            </span>
            <span className="h-px w-2 bg-[#C9788B]/60" />
            <span className="h-px w-10 bg-[#C9788B]/40 sm:w-12" />
          </div>

          {/* Description */}
          <p className="mt-4 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
            Homemade laddoos made with thoughtfully selected ingredients, traditional care, and no 
            refined sugar, palm oil, or preservatives.
          </p>
        </div>

        {/* =========================================================
            BRAND VALUES — 4 columns
        ========================================================= */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group relative flex flex-col overflow-hidden
                  rounded-lg border border-gray-200 bg-white
                  p-6 text-center
                  transition-all duration-300
                  sm:p-7
                "
              >

                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300"
                  style={{ backgroundColor: feature.bg }}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    style={{ color: feature.color }}
                  />
                </div>

                <h3 className="mt-5 text-[17px] font-semibold leading-tight text-[#1F4A2E] sm:text-[18px]">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-[12.5px] leading-[1.65] text-[#2c2c2c] sm:text-[13px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            WHOLESOME GOODNESS — Card-free editorial design
        ========================================================= */}
        <div className="relative mt-12 overflow-hidden rounded-lg border border-[#EFE3D2] px-6 py-4 sm:mt-16 sm:px-10 sm:py-6 lg:px-16">

          {/* Decorative corner blobs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FBEEF1]/60 blur-[90px]" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#F5E6D8]/50 blur-[90px]" />

          {/* Dotted pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle, #E8D9C4 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* ================= HEADING ================= */}
          <div className="relative mx-auto max-w-2xl text-center">

            <h3 className="font-serif anim-fadeUp delay-2 font-display text-[16px] sm:text-[20px] md:text-[22px] font-semibold tracking-wide mb-2 leading-snug md:whitespace-nowrap text-[#2c2c2c]">
              Wholesome Goodness For Everyone
            </h3>

            <p className="text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#7A6A5C]">
              Honest nourishment made for real-life moments.
            </p>
          </div>

          {/* ================= CARD-FREE COLUMNS ================= */}
          <div className="relative mt-6 grid gap-y-12 sm:mt-8 md:grid-cols-3 md:gap-x-0 md:gap-y-0">

            {goodnessCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`
                    group relative px-0 md:px-8 lg:px-10
                    ${index !== 0 ? "md:border-l md:border-[#E8D9C4]/60" : ""}
                  `}
                >
                  {/* Vertical divider enhancement — glow on hover */}
                  {index !== 0 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 hidden h-full w-px origin-top scale-y-0 bg-gradient-to-b from-transparent via-[#C9788B]/40 to-transparent transition-transform duration-700 group-hover:scale-y-100 md:block"
                    />
                  )}

                  {/* Icon — subtle, no box */}
                  <div className="mt-5 flex items-center gap-3">
                    <Icon
                      size={16}
                      strokeWidth={1.9}
                      className="text-[#C9788B] transition-transform duration-500"
                    />

                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#8B6F5C]">
                      {index === 0 ? "For Kids" : index === 1 ? "For Women" : "For Men"}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="mt-2 text-[14px] sm:text-[16px] md:text-[18px] font-semibold tracking-wide mb-2 leading-snug md:whitespace-nowrap text-[#2c2c2c]">
                    {card.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#2c2c2c] sm:text-[13.5px]">
                    {card.description}
                  </p>

                  {/* Small arrow link (decorative) */}
                  <div className="mt-3 flex items-center gap-1 text-[#C9788B]">
                    <span className="h-px w-6 bg-[#C9788B]/60 transition-all duration-500 group-hover:w-10" />
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>


        </div>

      </div>
    </section>
  );
}

export default About;