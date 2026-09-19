import img from "../../assets/hero_image.jpg";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#2f2f2f] sm:min-h-screen"
    >
      {/* ================= FONT IMPORT ================= */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

          .font-display { font-family: 'Playfair Display', serif; }
          .font-body    { font-family: 'Inter', sans-serif; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes mouseScroll {
            0%   { transform: translateY(0);   opacity: 0; }
            20%  { opacity: 1; }
            80%  { opacity: 1; }
            100% { transform: translateY(12px); opacity: 0; }
          }
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes drawLine {
            from { stroke-dashoffset: 200; }
            to   { stroke-dashoffset: 0; }
          }

          .anim-fadeUp { animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .anim-fadeIn { animation: fadeIn 1.2s ease both; }

          .delay-1 { animation-delay: 0.1s; }
          .delay-2 { animation-delay: 0.25s; }
          .delay-3 { animation-delay: 0.4s; }
          .delay-4 { animation-delay: 0.55s; }
          .delay-5 { animation-delay: 0.7s; }

          .draw-line path {
            stroke-dasharray: 200;
            animation: drawLine 1.4s ease-out 0.9s both;
          }

          .text-shadow-soft {
            text-shadow: 0 1px 10px rgba(0,0,0,0.4);
          }

          @media (prefers-reduced-motion: reduce) {
            .anim-fadeUp,
            .anim-fadeIn,
            .draw-line path {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        className="anim-fadeIn absolute inset-0 z-0 h-full w-full scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* ================= OVERLAYS ================= */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/65 via-black/40 to-black/15 sm:from-black/60 sm:via-black/35 sm:to-black/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-black/15 to-black/5 sm:from-black/40 sm:via-transparent sm:to-black/10" />
      <div className="absolute inset-0 z-10 bg-black/10 sm:bg-transparent" />

      {/* ================= CONTENT ================= */}
      {/* ✅ FIX: max-w-7xl → max-w-[1280px], aur padding ko reduce kiya
             taaki content left edge ke paas start ho */}
      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1300px] flex-col justify-center px-4 py-16 sm:min-h-screen sm:px-6 sm:py-20 md:px-10 lg:px-12">
        {/* ✅ FIX: mx-auto hata diya — text block hamesha left rahega on sm+ */}
        <div className="w-full max-w-2xl text-center sm:max-w-xl sm:text-left md:max-w-2xl">

          {/* ================= EYEBROW ================= */}
          <div className="anim-fadeUp delay-1 mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1.5 backdrop-blur-md sm:mb-6">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E7B5C1]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/95 sm:text-[12px] sm:tracking-[0.22em]">
              Handcrafted with Love
            </span>
          </div>

          {/* ================= HEADING ================= */}
          <h1 className="anim-fadeUp delay-2 text-shadow-soft font-display text-[27px] font-light leading-[1.18] tracking-[-0.02em] text-white min-[400px]:text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[50px]">
            Wholesome Goodness,
            <br />
            <span className="relative inline-block">
              <span className="text-[#E7A1B0] bg-clip-text font-normal italic">
                Irresistibly Delicious.
              </span>
            </span>
          </h1>

          {/* ================= DIVIDER ================= */}
          <div className="anim-fadeUp delay-3 mt-6 hidden items-center gap-2.5 sm:mt-7 sm:flex">
            <span className="h-px w-12 bg-[#B5697A]/70 sm:w-14" />
            <span className="h-px w-2 bg-[#B5697A]/60" />
            <span className="relative flex items-center justify-center">
              <span className="absolute h-3 w-3 rotate-45 rounded-[2px] bg-[#E7B5C1]/20" />
              <span className="relative h-2 w-2 rotate-45 rounded-[1.5px] border border-[#E7B5C1]/90 bg-[#E7B5C1]/30" />
            </span>
            <span className="h-px w-2 bg-[#B5697A]/60" />
            <span className="h-px w-12 bg-[#B5697A]/70 sm:w-14" />
          </div>

          {/* ================= DESCRIPTION ================= */}
          <p className="anim-fadeUp delay-3 text-shadow-soft mx-auto mt-4 max-w-[440px] text-[12.5px] leading-[1.5] text-white/90 min-[400px]:text-[13px] sm:mx-0 sm:mt-5 sm:max-w-lg sm:text-[13.5px] sm:leading-[1.85] md:text-[14px]">
            Delicious homemade Laddoos crafted with thoughtfully selected ingredients, comforting flavours, 
            and lots of love made with no refined sugar, no palm oil, and no preservatives.
          </p>

          {/* ================= RATING BADGE ================= */}
          <div className="anim-fadeUp delay-4 mt-5 flex items-center justify-center gap-2 sm:justify-start">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-3 w-3 text-[#E7B5C1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:h-3.5 sm:w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-shadow-soft text-[10.5px] tracking-wide text-white/90 sm:text-[12px]">
              <span className="text-white">4.9</span> · Loved by 50+ customers
            </span>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="anim-fadeUp delay-5 mt-7 flex flex-col items-stretch justify-center gap-3 min-[420px]:flex-row min-[420px]:items-center sm:mt-8 sm:justify-start sm:gap-3.5">

            <a
              href="#products"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#B5697A] px-6 py-3 text-[12.5px] text-white shadow-sm shadow-[#B5697A]/25 ring-1 ring-inset ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A55F70] hover:shadow-md sm:px-7 sm:py-3 sm:text-[13.5px]"
            >
              <span className="relative z-10">Explore Laddoos</span>
              <svg
                className="relative z-10 h-3.5 w-3.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out]" />
            </a>

            <a
              href="#about"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-[12.5px] text-white backdrop-blur-md transition-all duration-300 hover:bg-[#B5697A]/20 sm:px-7 sm:py-3 sm:text-[13.5px]"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-[#B5697A]/60">
                <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Discover Story
            </a>
          </div>

          {/* ================= TRUST BADGES ================= */}
          <div className="anim-fadeUp delay-5 mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 border-t border-white/15 pt-5 sm:mt-9 sm:justify-start sm:gap-x-7 sm:gap-y-3 sm:pt-6">
            {[
              "No Process Sugar",
              "No Palm Oil",
              "No preservatives",
            ].map((label) => (
              <div key={label} className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full border border-[#B5697A]/40 bg-[#B5697A]/25 backdrop-blur-sm sm:h-[18px] sm:w-[18px]">
                  <svg
                    className="h-2 w-2 text-[#E7B5C1] sm:h-2.5 sm:w-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-shadow-soft whitespace-nowrap text-[9.5px] tracking-wide text-white/85 sm:text-[12px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FLOATING STATS CARD ================= */}
        <div className="anim-fadeUp delay-5 absolute bottom-24 left-1/2 hidden -translate-x-1/2 md:bottom-10 md:left-auto md:right-8 md:translate-x-0 md:block lg:right-12 xl:right-16">
          <div className="rounded-2xl border border-white/20 bg-white/[0.08] px-5 py-3.5 shadow-2xl backdrop-blur-xl md:px-6 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex -space-x-2.5">
                {["#B5697A", "#8F4F60", "#E7B5C1"].map((color, index) => (
                  <div
                    key={index}
                    className="h-7 w-7 rounded-full border-2 border-white/40 shadow-sm md:h-8 md:w-8"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <p className="font-display text-sm leading-none text-white md:text-base">
                  50+
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/70 md:text-[9.5px]">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;