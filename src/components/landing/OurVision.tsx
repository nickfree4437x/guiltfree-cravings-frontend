function OurVision() {
  return (
    <section
      id="vision"
      className="bg-white px-6 py-20 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Content */}
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Our Vision
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Making every craving
              <span className="block text-[#8b542f]">
                feel a little better.
              </span>
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
              We envision a world where enjoying something sweet does not
              have to come with unnecessary compromise. Guilt Free Cravings
              aims to bring together delicious taste, thoughtful ingredients,
              and the warmth of homemade goodness.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Our goal is simple — create treats that people genuinely love
              and can feel good about sharing with the people who matter.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#8b542f]" />

              <span className="text-sm font-semibold text-slate-700">
                Taste • Quality • Thoughtfulness
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#f3e4d3]" />

            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80"
                alt="Thoughtfully prepared sweet treats"
                className="h-[380px] w-full object-cover sm:h-[480px]"
              />
            </div>

            <div className="absolute -bottom-5 left-5 rounded-2xl bg-white px-6 py-4 shadow-xl sm:left-8">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Our Promise
              </p>

              <p className="mt-1 text-lg font-bold text-[#8b542f]">
                Made to be enjoyed.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default OurVision;