import { Sparkles, MessageCircle, Clock, Heart } from "lucide-react";

function ContactIntro() {

  return (
    <section className="relative overflow-hidden bg-white px-6 pt-10 sm:px-10 sm:pt-12 md:px-14 md:pt-12 lg:px-20">

      {/* ================= DECORATIVE BACKGROUND ================= */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#F5E6D8]/50 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-[#FBEEF1]/60 blur-[120px]" />

      {/* Dotted pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #E8D9C4 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

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
        <p className="mt-2 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-[#2c2c2c]">
          Questions about your order, our laddoos, or anything else?
          We're here to help -{" "}
          <span className="italic text-[#5A4A3F]">
            always happy to chat.
          </span>
        </p>

      </div>
    </section>
  );
}

export default ContactIntro;