"use client";

import { Baby, HeartHandshake, Zap } from "lucide-react";

// ─── Static Data ──────────────────────────────────────────
const DISCIPLINE_POINTS = [
  {
    title: "Structured Kitchen Standards:",
    description:
      " Backed by years of operational management experience, we treat kitchen hygiene, measurement precision, and batch consistency with absolute discipline.",
  },
  {
    title: "Small-Batch Handcrafted:",
    description:
      " Prepared entirely by local homemakers, ensuring the authentic taste, care, and ingredient integrity of a true home kitchen.",
  },
  {
    title: "Transparent Ingredients:",
    description:
      " Zero artificial preservatives. Zero hidden stabilizers. Zero cheap seed oils. We cook only with what we know and trust.",
  },
];

const GOODNESS_CARDS = [
  {
    icon: Baby,
    title: "For Growing Kids",
    description:
      "A wholesome burst of natural energy for growing minds and active days.",
  },
  {
    icon: HeartHandshake,
    title: "For Busy Women",
    description:
      "A nourishing little break when the day gets long, busy, and demanding.",
  },
  {
    icon: Zap,
    title: "For Busy Men",
    description:
      "A wholesome bite between meetings, workouts, and everyday moments.",
  },
];

// ─── Component ────────────────────────────────────────────
function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden scroll-mt-10 pb-10 bg-[#fffbfc]"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-10 lg:px-12">
        {/* About Us: Content + Video */}
        <div className="grid items-stretch gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-14">
          {/* Left content */}
          <div className="flex flex-col justify-center md:-mt-6">
            <h2 className="mb-2 text-[22px] font-semibold text-center tracking-wide text-[#C9788B] sm:text-[26px] md:text-[30px]">
              About Us
            </h2>

            <div className="space-y-4 text-[12px] font-[350] leading-relaxed text-gray-600 md:text-[14px] lg:leading-relaxed text-justify">
              <p>
                We are a small team of process-driven planners and home-chefs
                grounding healthy snacking in real kitchen discipline.
              </p>
              <p>
                We combined a decade of operational management experience with
                traditional homemade care to fix a simple problem: making
                snacks that are genuinely clean, consistent, and safe.
              </p>
            </div>

            {/* Discipline list */}
            <div className="mt-4 sm:mt-6">
              <h3 className="mb- md:mb-2 text-center text-[18px] font-semibold leading-snug text-gray-700 sm:text-[20px] lg:text-left">
                The Discipline Behind Every Batch
              </h3>

              <ul className="space-y-3 text-[12px] font-[350] leading-relaxed text-gray-600 md:text-[14px] lg:leading-relaxed text-justify">
                {DISCIPLINE_POINTS.map((point) => (
                  <li key={point.title} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#C9788B]"
                    />
                    <p className="min-w-0 flex-1">
                      <span className="font-[400] text-[#C9788B]">
                        {point.title}
                      </span>
                      {point.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right video */}
          <div className="flex w-full items-stretch justify-center lg:justify-end">
            <div className="relative h-[260px] w-full max-w-[500px] rounded-md overflow-hidden border border-[#E8DCCF] bg-[#F5EEE5] sm:h-[350px] md:h-[400px] lg:h-auto lg:min-h-[430px]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Behind-the-scenes look at homemade laddoo preparation"
              >
                <source
                  src="https://res.cloudinary.com/dja5yspwr/video/upload/v1792216319/WhatsApp_Video_2026-10-17_at_11.16.34_AM_hk7h7w.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Wholesome Goodness */}
        <div className="relative py-4 sm:py-4">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-[18px] font-semibold leading-snug tracking-wide text-[#C9788B] sm:text-[22px]">
              Wholesome Goodness For Everyone
            </h3>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3 md:gap-0">
            {GOODNESS_CARDS.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`px-5 py-3 text-center sm:px-8 ${
                    index !== 0
                      ? "mt-2 border-t border-[#E8DCCF] pt-6 md:mt-0 md:border-l md:border-t-0 md:pt-3"
                      : ""
                  }`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8E8EC] text-[#C9788B]">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>

                  <h4 className="mt-3 text-[16px] font-semibold text-gray-700 sm:text-[18px]">
                    {card.title}
                  </h4>

                  <p className="mx-auto mt-1 max-w-[320px] text-[12px] leading-relaxed tracking-wide font-[350] text-gray-600 sm:text-[13px]">
                    {card.description}
                  </p>
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