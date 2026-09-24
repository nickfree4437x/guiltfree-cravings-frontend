import ContactIntro from "./sections/ContactIntro";
import ContactMethods from "./sections/ContactMethods";
import FAQSection from "./sections/FAQSection";
import OrderIssueForm from "./sections/OrderIssueForm";

function ContactUsPage() {
  return (
    <main className="relative min-h-screen bg-white">

      {/* =========================================================
          GLOBAL DECORATIVE BACKGROUND
      ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#F5E6D8]/40 blur-[120px]" />
        <div className="absolute -right-40 top-[40%] h-96 w-96 rounded-full bg-[#FBEEF1]/50 blur-[130px]" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#F5E6D8]/30 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #E8D9C4 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <div className="relative z-10">
        {/* ---------- INTRO ---------- */}
        <ContactIntro />

        {/* ---------- CONTACT METHODS ---------- */}
        <ContactMethods />

        {/* =========================================================
            FAQ + REPORT — SPLIT SECTION
        ========================================================= */}
        <section className="relative mx-auto w-full max-w-[1360px] px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-12 md:px-14 lg:px-20">


          {/* ================= SPLIT GRID ================= */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">

            {/* LEFT — Report Form */}
            <div className="min-w-0">
              <OrderIssueForm />
            </div>

            {/* RIGHT — FAQ */}
            <div className="min-w-0">
              <FAQSection />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ContactUsPage;