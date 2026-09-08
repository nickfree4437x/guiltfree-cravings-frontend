function OurStory() {
  const ingredients = [
    {
      number: "01",
      title: "Sattu",
      description:
        "For natural energy and the goodness of a trusted Indian staple.",
    },
    {
      number: "02",
      title: "Dates",
      description:
        "For clean, honest sweetness straight from nature.",
    },
    {
      number: "03",
      title: "Desi Ghee",
      description:
        "Because good fats were never meant to be the villain.",
    },
    {
      number: "04",
      title: "Jaggery",
      description:
        "Because sweetness doesn't need to be reinvented it just needs to be chosen thoughtfully.",
    },
  ];

  return (
    <section
      id="our-story"
      className="bg-gray-50 px-5 py-4 sm:py-6 lg:py-8"
    >
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
              Our Story
            </span>
          </div>
          
          <h2 className="mt-2 text-[18px] sm:text-[22px] md:text-[28px] font-semibold leading-tight tracking-wide text-[#2c2c2c]">
            Made with love, Eaten with joy
          </h2>
          
          <p className="mt-2 mx-auto max-w-xl text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500">
            A simpler way of making sweets rooted in tradition,
            made for today.         
            </p>
        </div>

        {/* =====================================================
            STORY INTRO
        ===================================================== */}

        {/* =====================================================
          WHERE IT STARTED - Card Style
      ===================================================== */}

      <div className="grid overflow-hidden rounded-md border border-[#e8ddd3] bg-white shadow-sm lg:grid-cols-[0.25fr_0.75fr]">

        {/* Label */}
        <div className="border-b border-[#e8ddd3] bg-[#f8f1eb] px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">

          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#8b542f]">
            Where It Started
          </span>

          <p className="mt-2 text-[12px] md:text-[14px] font-[350] leading-relaxed text-slate-600">
            Rooted in tradition, made for today.
          </p>

        </div>

        {/* Content */}
        <div className="px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-6">

          <p className="max-w-3xl text-[12px] md:text-[15px] font-[350] leading-relaxed sm:leading-6 text-slate-700">
            Every great sweet in India was invented before refined
            sugar existed. Somewhere along the way, we forgot that
            and let "healthy" and "delicious" become enemies instead
            of the same word.
          </p>

          <p className="mt-4 text-[14px] md:text-[16px] font-semibold leading-relaxed sm:leading-8 text-slate-900">
            We didn't invent anything new. We just stopped cutting
            corners.
          </p>

        </div>

      </div>

        {/* =====================================================
            WHAT GOES IN - Ingredients Grid
        ===================================================== */}

        <div className="border-y border-[#e8ddd3]">

          <div className="grid lg:grid-cols-[0.7fr_1.3fr]">

            {/* Section Introduction */}
            <div className="border-b border-[#e8ddd3] px-0 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-12 lg:pl-0">

              <span className="text-[10px] md:text-[11px] font-[350] uppercase tracking-[0.2em] text-[#b99a80]">
                What Goes In
              </span>

              <h3 className="mt-3 max-w-xs text-[18px] md:text-[26px] font-semibold leading-tight text-slate-900">
                Ingredients chosen with intention.
              </h3>

              <p className="mt-3 max-w-sm text-[12px] md:text-[15px] font-[350] leading-relaxed text-slate-500">
                Simple ingredients, familiar flavours and nothing
                unnecessary.
              </p>

            </div>

            {/* Ingredients Grid */}
            <div className="grid sm:grid-cols-2">

              {ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.number}
                  className={`
                    px-0 py-6 sm:px-6 sm:py-8
                    ${index === 1 ? "sm:border-l border-[#e8ddd3]" : ""}
                    ${index === 2 || index === 3 ? "border-t border-[#e8ddd3]" : ""}
                    ${index === 3 ? "sm:border-l" : ""}
                    ${index === 2 ? "sm:border-t-0" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] text-[#b99a80]">
                      {ingredient.number}
                    </span>
                  </div>

                  <h4 className="mt-2 text-lg sm:text-xl font-semibold text-slate-900">
                    {ingredient.title}
                  </h4>

                  <p className="mt-1 text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500">
                    {ingredient.description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* =====================================================
            MADE AT HOME - Card
        ===================================================== */}

        <div className="mt-6 sm:mt-8">

          <div className="grid overflow-hidden rounded-md border border-[#e8ddd3] bg-white shadow-sm lg:grid-cols-[0.25fr_0.75fr]">

            {/* Label */}
            <div className="border-b border-[#e8ddd3] bg-[#f8f1eb] px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">

              <span className="text-[10px] md:text-[11px] font-[350] uppercase tracking-[0.2em] text-[#8b542f]">
                Made At Home
              </span>

              <p className="mt-1 text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500">
                Homemade by choice, not by accident.
              </p>

            </div>

            {/* Quote */}
            <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10">

              <p className="max-w-3xl text-[12px] md:text-[14.5px] font-[350] leading-relaxed sm:leading-6 text-slate-700">
                Every laddoo starts in a home kitchen. Rolled by hand.
                Tasted before it's ever packed. Nothing goes in that we
                wouldn't hand to our own kids, our own parents, our own
                hungry 6pm selves.
              </p>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default OurStory;