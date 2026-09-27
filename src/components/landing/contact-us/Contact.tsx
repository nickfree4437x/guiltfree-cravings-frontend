import ContactIntro from "./sections/ContactIntro";
import ContactMethods from "./sections/ContactMethods";
import FAQSection from "./sections/FAQSection";
import OrderIssueForm from "./sections/OrderIssueForm";

function ContactUsPage() {
  return (
    <main className="relative min-h-screen bg-white">


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
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

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