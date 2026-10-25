import ContactIntro from "./sections/ContactIntro";
import ContactMethods from "./sections/ContactMethods";
import FAQSection from "./sections/FAQSection";
import OrderIssueForm from "./sections/OrderIssueForm";

function ContactUsPage() {
  return (
    <main id="contact" className="relative min-h-screen bg-white scroll-mt-16 pb-10 md:pb-12">
      <div className="relative z-10">
        <ContactIntro />
        <ContactMethods />

        {/* FAQ + Report — split section */}
        <section className="relative mx-auto w-full max-w-[1360px] px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-12 md:px-14 lg:px-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0">
              <OrderIssueForm />
            </div>
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