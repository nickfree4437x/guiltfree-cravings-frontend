function OurPromise() {
  const promises = [
    {
      number: "01",
      title: "No Refined Sugar",
      description:
        "Only jaggery and dates do the sweetening here pure, natural, and guilt-free.",
    },
    {
      number: "02",
      title: "No Preservatives",
      description:
        "Small batches, made to be eaten fresh, not stored forever. Real food, real simple.",
    },
    {
      number: "03",
      title: "Thoughtfully Sourced",
      description:
        "Real ghee, real nuts, nothing borrowed from a lab. Just honest, wholesome ingredients.",
    },
  ];

  return (
    <section
      id="our-promise"
      className="bg-[#fdfbf8] px-5 py-6 sm:py-8 lg:py-10"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
              Our Promise
            </span>
          </div>
          
          <h2 className="mt-2 text-[18px] sm:text-[22px] md:text-[28px] font-semibold leading-tight tracking-wide text-[#2c2c2c]">
            Simple Choices Better Ingredients
          </h2>
          
          <p className="mt-2 mx-auto max-w-xl text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500">
            We believe you shouldn't have to read the fine print to know
            what's going into something you eat. <span className="text-[#8b542f] font-[450]">No shortcuts.</span>
          </p>
        </div>
        
        {/* =====================================================
            PROMISE CARDS
        ===================================================== */}
        
        <div className="mt-8 sm:mt-10 lg:mt-12">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {promises.map((promise) => (
              <div
                key={promise.number}
                className="group relative bg-white rounded-md p-6 sm:p-8 shadow-sm transition-all duration-500 border border-gray-200] hover:border-[#8b542f]/20"
              >
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b542f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number */}
                <div className="relative">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#b99a80]">
                    {promise.number}
                  </span>
                </div>
                
                {/* Content */}
                <div className="relative mt-5">
                  <h3 className="text-xl sm:text-2xl font-bold leading-snug text-slate-900 transition-colors duration-300">
                    {promise.title}
                  </h3>
                  
                  <p className="mt-3 text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500 transition-colors duration-300">
                    {promise.description}
                  </p>
                
                </div>
                
              </div>
            ))}
          </div>
        </div>
        
        {/* =====================================================
            BOTTOM TRUST BAR
        ===================================================== */}
        
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6">
          
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f] text-[12px] md:text-[14.5px] font-[350]">
              ✓
            </span>
            <span className="text-[12px] md:text-[14.5px] font-[350] text-slate-600">
              100% Natural
            </span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f] text-[12px] md:text-[14.5px] font-[350]">
              ✓
            </span>
            <span className="text-[12px] md:text-[14.5px] font-[350] text-slate-600">
              Made with Love
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f] text-[12px] md:text-[14.5px] font-[350]">
              ✓
            </span>
            <span className="text-[12px] md:text-[14.5px] font-[350] text-slate-600">
              Freshly Baked Daily
            </span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f] text-[12px] md:text-[14.5px] font-[350]">
              ✓
            </span>
            <span className="text-[12px] md:text-[14.5px] font-[350] text-slate-600">
              Trusted Brand
            </span>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}

export default OurPromise;