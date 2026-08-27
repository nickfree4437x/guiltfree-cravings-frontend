import img from "../../assets/hero_image.png";

function Hero() {
  return (
    <section
      id="home"
      className="min-h-[calc(100vh-76px)] bg-[#fffaf5]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-76px)] items-center gap-6 py-10 md:gap-8 md:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-14">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <div className="order-2 max-w-xl lg:order-1 lg:pl-4">
  
          {/* Brand Eyebrow */}
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8b542f]" />
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b542f]">
              GuiltFree Cravings
            </p>
            <span className="h-px w-8 bg-[#8b542f]" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-[3.5rem]">
            Your Cravings.
            <br />
            <span className="text-[#8b542f]">Made Better.</span>
            <br />
            <span className="font-serif font-normal italic text-slate-800">
              Made with love.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-md">
            Indulge in delicious homemade treats crafted with thoughtfully
            selected ingredients, comforting flavours, and a whole lot of love.
            <span className="font-medium text-slate-800">
              {" "}Because your everyday cravings deserve something better.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary CTA */}
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full bg-[#8b542f] px-7 py-3.5 text-sm text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#754527] hover:shadow-md"
            >
              Explore Our Collection
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M4 10h11M11 6l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-6 py-3.5 text-sm text-slate-700 transition-all duration-200 hover:border-[#d8b99a] hover:bg-white hover:text-[#8b542f]"
            >
              Our Story
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Brand Authority Section */}
          <div className="mt-10 border-t border-[#e8ddd3] pt-7">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Why GuiltFree Cravings
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Authority Item 1 */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f]">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M10 3.5 12 7l3.8.6-2.7 2.7.6 3.8-3.7-1.8-3.7 1.8.6-3.8-2.7-2.7L8 7l2-3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Thoughtfully Made</p>
                  <p className="text-[11px] text-slate-500">Quality ingredients</p>
                </div>
              </div>

              {/* Authority Item 2 */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f]">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M10 16.5s-5.5-3.2-5.5-7.1A3.4 3.4 0 0 1 10 7.2a3.4 3.4 0 0 1 5.5 2.2c0 3.9-5.5 7.1-5.5 7.1Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Homemade Goodness</p>
                  <p className="text-[11px] text-slate-500">Made with care</p>
                </div>
              </div>

              {/* Authority Item 3 */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f]">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M5 10.5 8.2 14 15 6.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Made for You</p>
                  <p className="text-[11px] text-slate-500">Fresh & delicious</p>
                </div>
              </div>
            </div>
          </div>

        </div>


          {/* =====================================================
              RIGHT IMAGE
          ===================================================== */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">

            <div className="relative w-full max-w-[600px]">

              {/* Background Blob */}
              <div className="absolute -right-6 top-1/2 h-[88%] w-[88%] -translate-y-1/2 rounded-full bg-[#f2dfcc]" />

              <div className="relative">

                {/* Main Image */}
                <div className="overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(94,55,25,0.12)]">
                  <img
                    src={img}
                    alt="Delicious homemade laddoos"
                    className="h-[360px] w-full object-cover sm:h-[430px] lg:h-[520px]"
                  />
                </div>

                {/* Side Text */}
                <div className="absolute -left-7 top-1/2 hidden -translate-y-1/2 -rotate-90 lg:block">
                  <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b542f]">
                    GuiltFree Cravings
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-[#8b542f] shadow-lg backdrop-blur-sm">
                  01
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;