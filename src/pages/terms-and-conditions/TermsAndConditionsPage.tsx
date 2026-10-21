import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  FileText,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Scale,
  Mail,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#211A1C] sm:pt-24 pb-14">
      {/* ======================================================
          CENTERED HEADER
      ====================================================== */}
      <header className=" bg-white">

        <div className="mx-auto max-w-5xl px-5 py-6 text-center sm:px-8 sm:py-10">
          
          {/* Back Link + Heading Container */}
          <div className="relative flex min-h-[40px] items-center justify-center">
            
            {/* BACK TO HOME LINK - Always Top Left */}
            <Link
              to="/"
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                inline-flex items-center gap-1.5 text-[11px]
                transition text-[#C9788B] hover:underline
                sm:text-[12.5px] md:ml-8
              "
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>

            {/* MAIN HEADING */}
            <h1 className="text-[20px] font-semibold tracking-wide text-[#C9788B] leading-snug sm:text-[24px] md:text-[28px] md:whitespace-nowrap">
               Terms &amp; Conditions
            </h1>
          </div>

          <p className="mx-auto mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-700 sm:text-[13.5px]">
            Please review the terms for using our website and placing orders.
          </p>
        </div>
      </header>

      {/* ======================================================
          TERMS CONTENT
      ====================================================== */}
      <section className="px-4 sm:px-6">
        <article className="mx-auto max-w-4xl rounded-2xl border border-[#EAD9DC] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          
          {/* INTRO */}
          <div className="mb-8 rounded-xl border border-[#F0E3E5] bg-[#fffbfc] p-4 sm:p-5">
            <p className="text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
              These Terms &amp; Conditions apply to your use of the GuiltFree
              Cravings website and related services. By using the website or
              placing an order, you agree to the terms applicable to your use,
              subject to applicable law.
            </p>
            <p className="mt-3 text-[11px] font-medium text-[#62585B]">
              Last updated: 17 October 2026
            </p>
          </div>

          <div className="space-y-4 sm:space-y-8">
            
            {/* 1 */}
            <section id="acceptance" className="scroll-mt-6">
              <SectionHeading icon={<FileText size={18} />} number="01" title="Acceptance of Terms" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                These Terms &amp; Conditions govern your access to and use of
                the GuiltFree Cravings website, product listings, account
                features, and purchasing services.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                By browsing the website, creating an account, or placing an
                order, you acknowledge that you have read and understood the
                applicable terms. If you do not agree with these terms, please
                do not use the services.
              </p>
            </section>

            {/* 2 */}
            <section id="eligibility" className="scroll-mt-6">
              <SectionHeading icon={<UserCheck size={18} />} number="02" title="Eligibility & Accounts" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                You must be legally capable of entering into a binding
                agreement to place an order independently. If you are not
                legally capable of doing so, you should use the website with
                the involvement of a parent or legal guardian, where permitted
                by law.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Where account registration or phone verification is available,
                you agree to provide accurate information and take reasonable
                steps to protect access to your account and verification codes.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Please contact us promptly if you believe your account has
                been accessed or used without your authorisation.
              </p>
            </section>

            {/* 3 */}
            <section id="products" className="scroll-mt-6">
              <SectionHeading icon={<ShoppingBag size={18} />} number="03" title="Products & Information" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                GuiltFree Cravings offers laddoos and related products through
                its website. We make reasonable efforts to display product
                descriptions, photographs, ingredients, available packaging
                options, quantities, and prices accurately.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Product photographs are illustrative. Actual appearance,
                colour, texture, and packaging may vary slightly due to
                ingredient characteristics, preparation methods, or packaging
                availability.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Product availability, descriptions, and listed options may
                change from time to time. Any material product information
                provided at the time of purchase should be reviewed before
                placing an order.
              </p>
            </section>

            {/* 4 */}
            <section id="orders" className="scroll-mt-6">
              <SectionHeading icon={<ShoppingBag size={18} />} number="04" title="Orders & Acceptance" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                When placing an order, you are responsible for reviewing the
                selected products, quantities, packaging, delivery details,
                and total amount before completing the purchase.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                An order request is subject to availability, payment
                verification where applicable, and confirmation by GuiltFree
                Cravings. An order acknowledgement does not necessarily mean
                that the order has been finally accepted or dispatched.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If an order cannot be fulfilled, we will take reasonable steps
                to inform you and address any payment already collected in
                accordance with applicable law and our applicable refund
                process.
              </p>
            </section>

            {/* 5 */}
            <section id="pricing" className="scroll-mt-6">
              <SectionHeading icon={<CreditCard size={18} />} number="05" title="Pricing & Payments" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Product prices and applicable charges are displayed during the
                purchasing process. The amount payable should be reviewed at
                checkout before you confirm your order.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Payments may be processed through third-party payment service
                providers. Your payment is subject to the applicable
                provider's processes and terms. An order may require payment
                verification before it can be processed.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If a pricing, payment, or transaction discrepancy occurs,
                please contact us with the relevant order or transaction
                reference so we can review it.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If a genuine pricing or listing error is identified before
                fulfilment, we will take appropriate steps to resolve the
                issue and communicate with you, subject to applicable law.
              </p>
            </section>

            {/* 6 */}
            <section id="shipping" className="scroll-mt-6">
              <SectionHeading icon={<PackageCheck size={18} />} number="06" title="Delivery & Fulfilment" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Delivery availability, applicable charges, and estimated
                timelines depend on the delivery address, product availability,
                and fulfilment arrangements offered at the time of purchase.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Customers should provide a complete and accurate delivery
                address and reachable contact details. Incorrect or incomplete
                details may delay fulfilment.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Any delivery estimate provided is an estimate unless expressly
                confirmed otherwise. Delays may occur due to circumstances
                outside our reasonable control.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Please check the delivery information shown during checkout
                and any order confirmation for the terms applicable to your
                purchase.
              </p>
            </section>

            {/* 7 */}
            <section id="cancellations" className="scroll-mt-6">
              <SectionHeading icon={<RotateCcw size={18} />} number="07" title="Cancellations, Returns & Refunds" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If you need to cancel an order or report an issue, contact us
                as soon as possible and provide your order reference. Whether
                a cancellation can be accommodated may depend on the order's
                preparation or fulfilment status.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Because our products are food items, returns may be subject to
                food-safety considerations and applicable law. This does not
                affect any consumer rights or remedies that cannot lawfully
                be excluded.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If you receive an incorrect, damaged, defective, or otherwise
                problematic order, please contact us promptly with details
                and, where helpful, photographs so we can assess the issue.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Where a refund is approved or legally required, its processing
                and timing may depend on the payment provider and the original
                payment method. Any applicable cancellation or refund
                conditions should be communicated clearly before purchase.
              </p>
            </section>

            {/* 8 */}
            <section id="food" className="scroll-mt-6">
              <SectionHeading icon={<ShieldCheck size={18} />} number="08" title="Food Products & Allergens" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Please review the product description and available ingredient
                information before purchasing, especially if you have a food
                allergy, intolerance, or dietary restriction.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Products may contain ingredients such as nuts, dairy, or
                other allergens, depending on the product. Where relevant
                information is available, please refer to the product listing
                or packaging.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If you have a serious allergy or need clarification about
                ingredients or possible cross-contact, contact us before
                ordering. Do not purchase a product if you are uncertain
                whether it is suitable for your needs.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Product information is provided to help customers make
                informed choices and does not replace individual medical
                advice.
              </p>
            </section>

            {/* 9 */}
            <section id="responsibilities" className="scroll-mt-6">
              <SectionHeading icon={<UserCheck size={18} />} number="09" title="Customer Responsibilities" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                When using our website, you agree to provide accurate
                information, use the services lawfully, and avoid activities
                that may compromise the website or other customers.
              </p>
              <ul className="mt-4 space-y-3">
                <PolicyBullet>
                  Do not submit information you know to be false or misleading
                  when placing an order.
                </PolicyBullet>
                <PolicyBullet>
                  Do not attempt unauthorised access to accounts, systems, or
                  data.
                </PolicyBullet>
                <PolicyBullet>
                  Do not misuse the website, interfere with its operation, or
                  introduce malicious code.
                </PolicyBullet>
                <PolicyBullet>
                  Do not use our website for fraudulent, unlawful, or
                  unauthorised purposes.
                </PolicyBullet>
              </ul>
            </section>

            {/* 10 */}
            <section id="availability" className="scroll-mt-6">
              <SectionHeading icon={<AlertCircle size={18} />} number="10" title="Website Availability & Use" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                We aim to keep our website available and functioning properly.
                However, access may occasionally be interrupted for
                maintenance, technical issues, security measures, or
                circumstances beyond our control.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                We may update website features, product listings, or
                functionality as our services evolve. We will handle existing
                orders and customer rights in accordance with applicable law.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Nothing in these terms is intended to exclude any
                responsibility that cannot lawfully be excluded.
              </p>
            </section>

            {/* 11 */}
            <section id="liability" className="scroll-mt-6">
              <SectionHeading icon={<Scale size={18} />} number="11" title="Liability & Disputes" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                We will address customer concerns in good faith and handle our
                services in accordance with applicable law. Nothing in these
                terms limits consumer rights, statutory remedies, or
                liabilities that cannot lawfully be limited.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                If an issue arises, we encourage you to contact us first so
                that we can attempt to resolve it directly.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                Any dispute relating to the website or an order will be handled
                in accordance with applicable Indian law and the jurisdiction
                of competent authorities or courts, as applicable.
              </p>
            </section>

            {/* 12 */}
            <section id="changes" className="scroll-mt-6">
              <SectionHeading icon={<FileText size={18} />} number="12" title="Changes to These Terms" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                We may update these Terms &amp; Conditions to reflect changes
                in our products, services, business processes, or applicable
                legal requirements.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                The latest version will be published on this page with an
                updated date where appropriate. We encourage you to review the
                terms periodically.
              </p>
            </section>

            {/* 13 */}
            <section id="contact" className="scroll-mt-6">
              <SectionHeading icon={<Mail size={18} />} number="13" title="Contact Us" />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600 text-justify">
                For questions about these Terms &amp; Conditions, orders,
                payments, cancellations, or product concerns, contact
                GuiltFree Cravings using the details below.
              </p>

              <div className="mt-4 rounded-xl border border-[#EAD9DC] bg-[#fffbfc] p-4 sm:p-5">
                <h3 className="text-[12px] md:text-[16px] font-semibold text-gray-600">
                  GuiltFree Cravings
                </h3>

                <a
                  href="mailto:guiltfreecravings24@gmail.com"
                  className="mt-2 flex items-start gap-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-[#824958]" />
                  <span className="break-all">
                    guiltfreecravings24@gmail.com
                  </span>
                </a>

                <a
                  href="tel:+919667760119"
                  className="mt-2 flex items-start gap-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600"
                >
                  <span className="shrink-0 text-[#824958] text-[14px]">☎</span>
                  +91-9667760119
                </a>

                <p className="mt-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-600">
                  RZ-E-60, Chanakya Place Part - 1, Dabri, Janakpuri, West,
                  Delhi - 110059
                </p>
              </div>
            </section>
          </div>

          {/* BOTTOM LINKS */}
          <div className="mt-6 flex flex-col gap-3 border-t border-[#EAD9DC] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
                to="/"
                className="
                inline-flex items-center justify-center
                rounded-lg border border-[#EAD9DC] bg-white
                px-4 py-2.5
                text-[12px] text-[#373033] hover:text-[#824958]
                w-full sm:w-auto
                "
            >
                Return to Home
            </Link>

            <Link
                to="/privacy-policy"
                className="
                inline-flex items-center justify-center gap-1
                rounded-lg border border-[#EAD9DC] bg-white
                px-4 py-2.5
                text-[12px] text-[#373033] hover:text-[#824958]
                w-full sm:w-auto
                "
            >
                Read Privacy Policy
                <ChevronRight size={15} />
            </Link>
            </div>
        </article>
      </section>
    </main>
  );
}

function SectionHeading({
  title,
}: {
  icon: ReactNode;
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="min-w-0">
        <h2 className="pt-0 text-[16px] font-semibold leading-snug text-gray-600 sm:text-[18px]">
          {title}
        </h2>
      </div>
    </div>
  );
}

function PolicyBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[12px] sm:text-[13px] leading-[1.8] text-[#4B4446]">
      <span className="mt-[10px] sm:mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9788B]" />
      <span>{children}</span>
    </li>
  );
}

export default TermsAndConditionsPage;