import { ChefHat, BadgeCheck, HeartHandshake } from "lucide-react";

function OurVision() {
  const visionPoints = [
    {
      number: "01",
      title: "Taste",
      description:
        "Delicious flavours that make every craving worth giving in to.",
      icon: ChefHat,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      number: "02",
      title: "Quality",
      description:
        "Thoughtfully selected ingredients chosen with care and confidence.",
      icon: BadgeCheck,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      number: "03",
      title: "Thoughtfulness",
      description:
        "Every treat made with attention, warmth, and a genuine love for good food.",
      icon: HeartHandshake,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <section
      id="vision"
      className="bg-white px-5 py-4 sm:py-6 lg:py-8"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
              Our Vision
            </span>
          </div>
          
          <h2 className="mt-2 text-[18px] sm:text-[22px] md:text-[28px] font-semibold leading-tight tracking-wide text-[#2c2c2c]">
            Making every craving feel a little better
          </h2>
          
          <p className="mt-2 mx-auto max-w-xl text-[12px] md:text-[14.5px] font-[350] leading-relaxed text-slate-500">
            We envision a world where enjoying something sweet does not have
            to come with unnecessary compromise.
          </p>
        </div>
        
        {/* =====================================================
            VISION POINTS - Refined Layout
        ===================================================== */}
        
        <div className="mt-14 sm:mt-16 grid md:grid-cols-3 gap-6 sm:gap-8">
          {visionPoints.map((point, index) => {
            const Icon = point.icon;
            
            return (
              <div key={point.number} className="text-center group">
                
                {/* Icon Circle with Different Colors */}
                <div className="relative flex justify-center">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${point.bgColor} ${point.iconColor} transition-all duration-500`}>
                    <Icon size={28} strokeWidth={1.6} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[12px] md:text-[15px] font-[350] leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                    {point.description}
                  </p>
                </div>
              
              </div>
            );
          })}
        </div>
        
        {/* =====================================================
            BOTTOM QUOTE
        ===================================================== */}
        
        <div className="mx-auto mt-6 sm:mt-8 max-w-2xl text-center">
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#d8c6b5]"></span>
            <span className="h-2 w-2 rounded-full bg-[#8b542f]"></span>
            <span className="h-px w-12 bg-[#d8c6b5]"></span>
          </div>
          
          <p className="mt-4 font-serif text-[14px] sm:text-[20px] font-medium italic leading-relaxed text-[#8b542f]">
            "Better choices should never mean less enjoyment."
          </p>
          
        </div>
        
      </div>
    </section>
  );
}

export default OurVision;