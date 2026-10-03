import { Sparkles } from "lucide-react";

function ContactIntro() {

  return (
    <section className="relative overflow-hidden bg-white px-6 pt-0 sm:px-10 sm:pt-2 md:px-14 md:pt-6 lg:px-20">


      {/* Floating sparkles (decoration) */}
      <Sparkles
        className="pointer-events-none absolute left-[8%] top-[30%] hidden h-4 w-4 text-[#B5697A]/25 md:block"
        strokeWidth={1.6}
      />
      <Sparkles
        className="pointer-events-none absolute right-[10%] top-[25%] hidden h-5 w-5 text-[#B5697A]/20 md:block"
        strokeWidth={1.6}
      />

      {/* ================= CONTENT ================= */}
      <div className="relative mx-auto max-w-3xl text-center">
        
        {/* Heading */}
        <h1 className="anim-fadeUp delay-2  text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide mb-2 leading-snug md:whitespace-nowrap text-[#C9788B]">
          How can we help
          ?
        </h1>

        {/* Description */}
        <p className="mt-2 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-700">
          Questions about your order, our laddoos, or anything else?
          We're here to help always happy to chat.
        </p>

      </div>
    </section>
  );
}

export default ContactIntro;