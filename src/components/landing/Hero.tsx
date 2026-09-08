import img from "../../assets/hero_image.png";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-[95vh] lg:min-h-screen w-full overflow-hidden bg-[#2f2f2f]"
    >
      {/* =========================================================
          BACKGROUND IMAGE with Overlay
      ========================================================= */}

      <div
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />

      {/* Dark Overlay - responsive opacity */}
      <div className="absolute inset-0 z-10 bg-black/50 sm:bg-black/45 md:bg-black/40 lg:bg-black/35" />

      {/* =========================================================
          CONTENT - Fully Centered
      ========================================================= */}

      <div className="relative z-20 mx-auto flex min-h-[90vh] sm:min-h-[95vh] lg:min-h-screen w-full max-w-7xl flex-col items-center justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 text-center">
        

        {/* =====================================================
            HEADING
        ===================================================== */}

        <h1 className="mt-5 text-[26px] sm:text-[30px] md:text-[40px] font-bold tracking-wide mb-2 leading-snug md:whitespace-nowrap text-white">
          Wholesome Goodness,
          Irresistible Taste  
        </h1>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <p className="mt-3 sm:mt-4 md:mt-5 max-w-xl sm:max-w-2xl text-[12px] md:text-[14px] font-[350] leading-relaxed sm:leading-relaxed text-white">
          Delicious homemade treats crafted with thoughtfully selected ingredients, comforting
          flavours, and a whole lot of love, made to bring a little more joy to every craving.
        </p>

        {/* =====================================================
            BUTTONS
        ===================================================== */}

        <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
          
          {/* Primary CTA */}
          <a
            href="#products"
            className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#8b542f] px-5 sm:px-7 md:px-9 py-2 sm:py-2.5 md:py-3 text-[12px] md:text-[13px] text-white shadow-sm transition-all duration-300 hover:bg-[#754527]"
          >
            Explore Collection
          </a>
          
          {/* Secondary CTA */}
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-[12px] md:text-[13px] text-white transition-all duration-300 hover:bg-white/20"
          >
            Discover Story
          </a>
          
        </div>

        {/* =====================================================
            TRUST BADGES
        ===================================================== */}

        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-2 sm:gap-y-3 border-t border-white/15 pt-5 sm:pt-6 md:pt-7">
          
          {/* 1. Quality Ingredients */}
          {/* <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <span className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-[#8b542f]/40 backdrop-blur-sm text-[10px] sm:text-[12px] md:text-[14px] text-white">
              ✓
            </span>
            <span className="text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] text-white/80 whitespace-nowrap">
              Quality Ingredients
            </span>
          </div> */}
          
          {/* 2. Homemade Goodness */}
          {/* <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <span className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-[#8b542f]/40 backdrop-blur-sm text-[10px] sm:text-[12px] md:text-[14px] text-white">
              ✓
            </span>
            <span className="text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] text-white/80 whitespace-nowrap">
              Homemade Goodness
            </span>
          </div> */}
          
          {/* 3. Made with Care */}
          {/* <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <span className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-[#8b542f]/40 backdrop-blur-sm text-[10px] sm:text-[12px] md:text-[14px] text-white">
              ✓
            </span>
            <span className="text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] text-white/80 whitespace-nowrap">
              Made with Care
            </span>
          </div> */}
          
        </div>

        {/* =====================================================
              SCROLL INDICATOR
          ===================================================== */}

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center">
            <div className="relative flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-white/70"
                style={{
                  animation: "mouseScroll 1.8s ease-in-out infinite",
                }}
              />
            </div>

            <style>
              {`
                @keyframes mouseScroll {
                  0% {
                    transform: translateY(0);
                    opacity: 0;
                  }
                  20% {
                    opacity: 1;
                  }
                  80% {
                    opacity: 1;
                  }
                  100% {
                    transform: translateY(12px);
                    opacity: 0;
                  }
                }
              `}
            </style>
          </div>

      </div>
    </section>
  );
}

export default Hero;