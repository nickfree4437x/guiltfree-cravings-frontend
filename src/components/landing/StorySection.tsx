function OurStory() {
  return (
    <section
      id="our-story"
      className="bg-white px-6 py-20 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SECTION INTRO
        ===================================================== */}
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">

          {/* Left Label */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b542f]">
              Our Story
            </span>

            <div className="mt-5 hidden h-px w-16 bg-[#d8c5b4] lg:block" />

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500 lg:mt-8">
              A simpler way of making sweets — rooted in tradition,
              made for today.
            </p>
          </div>


          {/* Right Intro */}
          <div className="max-w-3xl">

            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.6rem]">
              We didn't reinvent
              <span className="block font-serif font-normal italic text-[#8b542f]">
                the sweet.
              </span>
              We just stopped cutting corners.
            </h2>

          </div>

        </div>


        {/* =====================================================
            STORY CONTENT
        ===================================================== */}
        <div className="mt-16 grid gap-10 border-t border-[#e7ddd5] pt-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">

          {/* Story Part 1 */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b542f]">
              Where It Started
            </span>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              Every great sweet in India was invented before refined sugar
              existed. Somewhere along the way, we forgot that — and let
              "healthy" and "delicious" become enemies instead of the same
              word.
            </p>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              We didn't invent anything new. We just stopped cutting
              corners.
            </p>
          </div>


          {/* Story Part 2 */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b542f]">
              What Goes In
            </span>

            <div className="mt-5 space-y-5">

              <div>
                <h3 className="font-semibold text-slate-900">
                  Sattu
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                  For natural energy and the goodness of a trusted
                  Indian staple.
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-slate-900">
                  Dates
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                  For clean, honest sweetness straight from nature.
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-slate-900">
                  Desi Ghee
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                  Because good fats were never meant to be the villain.
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-slate-900">
                  Jaggery
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                  Because sweetness doesn't need to be reinvented —
                  it just needs to be chosen thoughtfully.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            HOMEMADE PHILOSOPHY
        ===================================================== */}
        <div className="mt-16 rounded-3xl bg-[#fffaf5] px-6 py-10 sm:px-10 sm:py-12 lg:mt-20 lg:px-14">

          <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">

            {/* Quote Mark */}
            <div className="font-serif text-6xl leading-none text-[#d8c0aa]">
              “
            </div>


            {/* Content */}
            <div className="max-w-3xl">

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b542f]">
                Made At Home
              </span>

              <p className="mt-5 text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9">
                Every laddoo starts in a home kitchen. Rolled by hand.
                Tasted before it's ever packed. Nothing goes in that we
                wouldn't hand to our own kids, our own parents, our own
                hungry 6pm selves.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            SMALL ON PURPOSE
        ===================================================== */}
        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">

          <div className="max-w-2xl">

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b542f]">
              Small By Choice
            </span>

            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              We're small on purpose — four recipes, made fresh, not
              mass-produced. That's not a limitation.
              <span className="font-semibold text-slate-900">
                {" "}That's the whole point.
              </span>
            </p>

          </div>


          {/* Recipe Count */}
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border border-[#d9c7b7] bg-[#fffaf5]">

            <span className="text-3xl font-bold text-[#8b542f]">
              04
            </span>

            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Recipes
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OurStory;