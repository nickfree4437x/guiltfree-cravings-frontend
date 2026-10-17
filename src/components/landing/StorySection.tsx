
export default function OurStory() {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative isolate overflow-hidden scroll-mt-12 bg-white px-5 py-16 sm:px-8 md:py-20"
    >

      <div className="mx-auto max-w-6xl">
        {/* Main story panel */}
        <div className="relative overflow-hidden rounded-xl border border-[#C9788B]/20 bg-white/85 shadow-sm sm:rounded-2xl">
          {/* Top brand accent */}
          <div
            aria-hidden="true"
            className="h-1.5 w-full bg-[#C9788B]"
          />

          <div className="relative px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-16">
            {/* Decorative quotation mark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-5 select-none font-serif text-7xl leading-none text-[#C9788B]/15 sm:left-10 sm:top-7 sm:text-8xl lg:left-14"
            >
              “
            </span>

            {/* Story content — original copy only */}
            <div className="relative mx-auto max-w-4xl pt-7 sm:pt-9">
              <p className="text-center text-[12px] font-[350] leading-relaxed text-gray-600 md:text-[16px] lg:leading-relaxed">
                Somewhere between “I shouldn’t” and “just one bite,” we found a
                better answer:{" "}
                <span className="text-[#C9788B]">
                  no guilt.
                </span>{" "}
                Our laddoos are hand-rolled with desi ghee and real nuts,
                sweetened only by jaggery and dates. No refined sugar. No
                preservatives. No apology needed. Not a diet snack pretending
                to be a treat. Real energy for kids after school, women by 4pm,
                and men between meetings.
              </p>
            </div>

            {/* Elegant divider */}
            <div
              aria-hidden="true"
              className="my-8 flex items-center justify-center gap-3 sm:my-8"
            >
              <span className="h-px w-12 bg-[#C9788B]/35 sm:w-20" />
              <span className="h-2 w-2 rotate-45 bg-[#C9788B]" />
              <span className="h-px w-12 bg-[#C9788B]/35 sm:w-20" />
            </div>

            {/* Original brand statement */}
            <h2
              id="our-story-heading"
              className="mx-auto max-w-4xl text-center text-[18px] font-medium leading-snug tracking-tight text-gray-700 md:text-text-[28px]"
            >
              Nourishment You Can Taste,
              <span className="mt-1 block text-[#C9788B]">
                Tradition You Can Trust.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
