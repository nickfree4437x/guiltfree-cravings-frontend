import {
  House,
  Leaf,
  ShieldCheck,
  Droplet,
  Baby,
  HeartHandshake,
  Zap,
} from "lucide-react";

function About() {
  const values = [
    {
      icon: House,
      title: "Made at Home",
      description:
        "Hand-rolled in small batches with genuine care, comfort, and attention to detail.",
    },
    {
      icon: Leaf,
      title: "No Refined Sugar",
      description:
        "Sweetened naturally with raw jaggery and dates instead of refined sugar.",
    },
    {
      icon: ShieldCheck,
      title: "No Preservatives",
      description:
        "Freshly made without artificial preservatives or unnecessary additives.",
    },
    {
      icon: Droplet,
      title: "No Palm Oil",
      description:
        "Made with authentic Desi Ghee and without palm oil or hydrogenated fats.",
    },
  ];

  const goodnessCards = [
  {
    icon: Baby,
    label: "FOR KIDS",
    title: "For Growing Kids",
    description:
      "A wholesome burst of natural energy for growing minds and active days.",
  },
  {
    icon: HeartHandshake,
    label: "FOR WOMEN",
    title: "For Busy Women",
    description:
      "A nourishing little break when the day gets long, busy, and demanding.",
  },
  {
    icon: Zap,
    label: "FOR MEN",
    title: "For Busy Men",
    description:
      "A wholesome bite between meetings, workouts, and everyday moments.",
  },
 ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white pb-10"
    >

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-12">

        {/* ===================================================
            TOP — STORY + VIDEO
        =================================================== */}

        <div className="grid items-center gap-6 py-10 sm:py-24 lg:grid-cols-2 lg:gap-14">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="text-center lg:px-4">

            {/* Main heading */}

            <h2 className="text-[18px] sm:text-[24px] md:text-[22px] font-[600] text-[#C9788B] tracking-wide leading-snug mb-1">
              Welcome To Guilt Free Cravings
            </h2>

            {/* Intro description */}

            <p className="text-gray-800 text-[11px] sm:text-[13px] md:text-[13px] tracking-wide leading-relaxed mb-3 max-w-[320px] sm:max-w-[600px] mx-auto">
              Homemade laddoos crafted with thoughtfully selected
              ingredients, comforting flavours, and lots of love.
            </p>

            {/* =================================================
                VALUE CONTENT
            ================================================= */}

            <div className="mx-auto md:mt-7 max-w-[620px] md:space-y-6">

              {values.map((value) => {
                // const Icon = value.icon;

                return (
                  <div key={value.title}>

                    {/* Small heading */}

                    <div className="flex items-center justify-center gap-2">

                      <h3 className="text-[#C9788B] font-medium text-[13px] sm:text-[14px] md:text-[15px] mb-1">
                        {value.title}
                      </h3>
                    </div>

                    {/* Description */}

                    <p className="text-gray-800 text-[11px] sm:text-[13px] md:text-[13px] tracking-wide leading-relaxed mb-3 max-w-[320px] sm:max-w-[600px] mx-auto">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT — VIDEO
          ================================================= */}

          <div className="relative">

            <div className="relative max-w-[340px] sm:max-w-[420px] md:max-w-[500px] h-[230px] sm:h-[360px] md:h-[370px] overflow-hidden border border-[#E8DCCF] bg-[#F5EEE5]">

              <video
                className="aspect-[4/3] w-full object-cover"
                controls
                muted
                loop
                playsInline
                poster="https://placehold.co/1000x750/F5EEE5/1F4A2E?text=GuiltFree+Kitchen"
              >
                <source
                  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            </div>

            {/* Small caption */}

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C9788B]/40" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A8879]">
                Our small-batch process
              </span>

              <span className="h-px w-8 bg-[#C9788B]/40" />
            </div>
          </div>
        </div>

        {/* ===================================================
            WHOLESOME GOODNESS
        =================================================== */}

        <div className="relative md:-mt-8  py-0 sm:py-1 lg:py-2">

          {/* =================================================
              SECTION HEADING
          ================================================= */}

          <div className="relative mx-auto max-w-2xl text-center">

            <h3 className="text-[20px] sm:text-[24px] md:text-[22px] font-[550] text-[#C9788B] tracking-wide leading-snug">
              Wholesome Goodness For Everyone
            </h3>
          </div>

          {/* =================================================
              GOODNESS CONTENT
          ================================================= */}

          <div className="relative mt-6 grid md:grid-cols-3">

            {goodnessCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`
                    px-6 py-2 text-center sm:px-10
                    ${
                      index !== 0
                        ? "mt-2 pt-4 md:mt-0 md:pt-2"
                        : ""
                    }
                  `}
                >

                  {/* Icon */}

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8E8EC] text-[#C9788B]">
                    <Icon
                      size={21}
                      strokeWidth={1.7}
                    />
                  </div>


                  {/* Title */}

                  <h4 className="mt-2 text-[17px] font-semibold text-[#1F4A2E] sm:text-[18px]">
                    {card.title}
                  </h4>

                  {/* Description */}

                  <p className="text-gray-800 text-[12px] sm:text-[13px] md:text-[13px] 
                           leading-relaxed tracking-wide">
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