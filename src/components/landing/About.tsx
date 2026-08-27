function About() {
  return (
    <section id="about" className="bg-[#fffaf5] px-6 py-20 sm:py-24 lg:px-8 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-4xl relative">
        
        {/* Decorative subtle elements */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f2dfcc]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#f2dfcc]/20 blur-3xl" />

        {/* Section Header */}
        <div className="relative text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-10 bg-[#8b542f]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b542f]">
              About GuiltFree Cravings
            </span>
            <span className="h-px w-10 bg-[#8b542f]" />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-[4rem]">
            A Healthy Reason to Say{" "}
            <span className="font-serif font-normal italic text-[#8b542f] relative">
              Yes
              <span className="absolute -bottom-2 left-0 right-0 h-1 w-full bg-[#8b542f]/20 rounded-full" />
            </span>{" "}
            to Sweet.
          </h2>
        </div>

        {/* Main Story - Clean Text Flow */}
        <div className="relative mt-14 space-y-8">
          
          {/* First Paragraph - The Dilemma */}
          <div className="rounded-3xl bg-white/60 p-8 backdrop-blur-sm sm:p-10">
            <p className="text-center text-lg leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
              Somewhere between{" "}
              <span className="font-semibold text-slate-800">"I shouldn't"</span>
              {" "}and{" "}
              <span className="font-semibold text-slate-800">"just one bite,"</span>
              {" "}we found a better answer:{" "}
              <span className="font-bold text-[#8b542f] text-xl sm:text-2xl">don't.</span>
            </p>
          </div>

          {/* Second Paragraph - The Promise */}
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-[#8b542f]/20" />
            <div className="pl-6 sm:pl-8">
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
                Our laddoos are rolled by hand, warm with desi ghee, studded
                with real nuts, and sweetened only by{" "}
                <span className="font-semibold text-[#8b542f]">jaggery</span>
                {" "}and{" "}
                <span className="font-semibold text-[#8b542f]">dates</span>
                {" "}— never a grain of refined sugar. No preservatives hiding in
                the fine print. No apology needed.
              </p>
            </div>
          </div>

          {/* Third Paragraph - The Impact */}
          <div className="relative">
            <div className="absolute right-0 top-0 h-full w-1 rounded-full bg-[#8b542f]/20" />
            <div className="pr-6 text-right sm:pr-8">
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
                This isn't a diet snack pretending to be a treat.{" "}
                <span className="font-medium text-slate-800">It's the real thing,</span>
                {" "}made honestly — for kids who need a burst of energy after school,
                for women running on empty by 4pm, for men who want something that
                actually fuels them between meetings.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Brand Message */}
        <div className="relative mx-auto mt-16 max-w-2xl border-t border-[#e7ddd3] pt-10">
          
          {/* Decorative dots */}
          <div className="absolute -top-1 left-1/2 flex -translate-x-1/2 gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b542f]/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b542f]/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b542f]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b542f]/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b542f]/20" />
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              One Sweet Tooth. Three Reasons to Say Yes.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-12 bg-[#d8c6b5]" />
              <p className="font-serif text-2xl font-medium italic text-[#8b542f] sm:text-3xl">
                Nourishment You Can Taste,
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                Tradition You Can Trust.
              </p>
              <span className="h-px w-12 bg-[#d8c6b5]" />
            </div>

            {/* Clean badge */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#d8c6b5] bg-white/50 px-5 py-2 backdrop-blur-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                No Preservatives
              </span>
              <span className="h-1 w-1 rounded-full bg-[#d8c6b5]" />
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                No Refined Sugar
              </span>
              <span className="h-1 w-1 rounded-full bg-[#d8c6b5]" />
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                100% Love
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default About;