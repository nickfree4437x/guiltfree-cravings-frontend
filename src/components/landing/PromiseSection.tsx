function OurPromise() {
  const promises = [
    {
      number: "01",
      title: "No Refined Sugar",
      description:
        "Only jaggery and dates do the sweetening here.",
    },
    {
      number: "02",
      title: "No Preservatives",
      description:
        "Small batches, made to be eaten fresh, not stored forever.",
    },
    {
      number: "03",
      title: "Thoughtfully Sourced Ingredients",
      description:
        "Real ghee, real nuts, nothing borrowed from a lab.",
    },
  ];

  return (
    <section
      id="our-promise"
      className="bg-white px-6 py-20 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b542f]">
            Our Promise
          </span>

          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Simple choices.
            <span className="block font-serif font-normal italic text-[#8b542f]">
              Better ingredients.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
            We believe you shouldn't have to read the fine print to know
            what's going into something you eat.
          </p>

        </div>


        {/* =====================================================
            PROMISES
        ===================================================== */}
        <div className="mt-14 grid border-y border-[#e8ddd3] md:grid-cols-3">

          {promises.map((promise, index) => (
            <div
              key={promise.number}
              className={`
                group px-6 py-9 sm:px-8 sm:py-10
                ${
                  index !== 0
                    ? "border-t border-[#e8ddd3] md:border-l md:border-t-0"
                    : ""
                }
              `}
            >

              {/* Number */}
              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold tracking-[0.15em] text-[#b99a80]">
                  {promise.number}
                </span>

                <span className="h-2 w-2 rounded-full bg-[#8b542f] transition-transform duration-200 group-hover:scale-150" />

              </div>


              {/* Content */}
              <div className="mt-8">

                <h3 className="max-w-xs text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                  {promise.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
                  {promise.description}
                </p>

              </div>

            </div>
          ))}

        </div>


        {/* =====================================================
            CLOSING LINE
        ===================================================== */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">

          <span className="h-px w-10 bg-[#d9c5b2]" />

          <p className="font-serif text-lg italic text-[#8b542f] sm:text-xl">
            What goes in matters.
          </p>

          <span className="h-px w-10 bg-[#d9c5b2]" />

        </div>

      </div>
    </section>
  );
}

export default OurPromise;