import { Sparkles } from "lucide-react";

// ─── Floating sparkles (decorative) ───────────────────────
const SPARKLES = [
  { className: "left-[8%] top-[30%] h-4 w-4 text-[#B5697A]/25" },
  { className: "right-[10%] top-[25%] h-5 w-5 text-[#B5697A]/20" },
];

function ContactIntro() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-4 sm:px-10 sm:pt-2 md:px-14 md:pt-6 lg:px-20">
      {/* Decorative sparkles (desktop only) */}
      {SPARKLES.map((s, i) => (
        <Sparkles
          key={i}
          strokeWidth={1.6}
          className={`pointer-events-none absolute hidden md:block ${s.className}`}
        />
      ))}

      {/* Content */}
      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="anim-fadeUp delay-2 mb-2 text-[20px] font-semibold leading-snug tracking-wide text-[#C9788B] sm:text-[24px] md:whitespace-nowrap md:text-[28px]">
          We’re here to help, always happy to chat.
        </h1>

        <p className="mx-auto mt-2 max-w-[580px] text-[12.5px] font-[350] leading-relaxed tracking-wide text-gray-600 sm:text-[13.5px] md:text-[14px]">
          Have questions about your order or our handcrafted laddoos? Let's talk.
        </p>

        <p className="mt-3 text-[12px] leading-relaxed text-gray-600 sm:text-[13px]">
          For gift &amp; bulk orders, contact us at{" "}
          <a
            href="tel:+919667760119"
            className="hover:underline text-[#C9788B] transition-colors hover:text-[#B8667B]"
          >
            +91-9667760119
          </a>{" "}
          or{" "}
          <a
            href="mailto:guiltfreecravings24@gmail.com"
            className="break-all hover:underline text-[#C9788B] transition-colors hover:text-[#B8667B]"
          >
            guiltfreecravings24@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export default ContactIntro;