import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

// ─── Shared Classes ───────────────────────────────────────
const PARA = "mt-1 text-[11px] leading-relaxed text-gray-600 text-justify sm:text-[13px]";
const SECTION = "scroll-mt-6";

// ─── Bullet ───────────────────────────────────────────────
function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9788B]" />
      <span>{children}</span>
    </li>
  );
}

// ─── Component ────────────────────────────────────────────
function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-20 text-[#211A1C] sm:pt-24 pb-14">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-6 text-center sm:px-8 sm:py-10">
          <div className="relative flex min-h-[40px] items-center justify-center">
            {/* Back to home */}
            <Link
              to="/"
              className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-[11px] transition text-[#C9788B] hover:underline sm:text-[12.5px] md:ml-8"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>

            {/* Heading */}
            <h1 className="text-[20px] font-semibold tracking-wide text-[#C9788B] leading-snug sm:text-[24px] md:text-[28px] md:whitespace-nowrap">
              Privacy Policy
            </h1>
          </div>

          <p className="mx-auto mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-700 sm:text-[13.5px]">
            Your privacy matters. Learn how we protect and use your information.
          </p>
        </div>
      </header>

      {/* Policy content */}
      <section className="px-4 py-0 sm:px-6 sm:py-0">
        <article className="mx-auto max-w-4xl rounded-2xl border border-[#EAD9DC] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          {/* Intro */}
          <div className="mb-6 rounded-xl border border-[#F0E3E5] bg-[#fffbfc] p-4 sm:p-5">
            <p className="mt-2 text-[11px] leading-relaxed text-gray-600 text-justify sm:text-[13px]">
              This policy describes the information we may collect, why we
              use it, and the choices available to you. Our practices depend
              on the services and features you use.
            </p>
            <p className="mt-2 text-xs text-[#62585B]">Last updated: 17 October 2026</p>
          </div>

          <div className="space-y-4 sm:space-y-8">
            {/* Collection */}
            <section id="collection" className={SECTION}>
              <p className={PARA}>
                When you use our website, we may collect information you
                provide, including:
              </p>
              <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-gray-600 sm:text-[13px]">
                <Bullet>
                  <strong className="text-[12px] font-semibold text-gray-600 sm:text-[14px]">Contact details:</strong>{" "}
                  Name, phone number, email address, and delivery address.
                </Bullet>
                <Bullet>
                  <strong className="text-[12px] font-semibold text-gray-600 sm:text-[14px]">Account and order details:</strong>{" "}
                  Account information, selected products, order history, and
                  order-related communications.
                </Bullet>
                <Bullet>
                  <strong className="text-[12px] font-semibold text-gray-600 sm:text-[14px]">Technical information:</strong>{" "}
                  Device, browser, and website usage information where collected.
                </Bullet>
              </ul>
            </section>

            {/* Usage */}
            <section id="usage" className={SECTION}>
              <p className={PARA}>
                We use relevant information to manage accounts, verify logins
                where applicable, process orders, coordinate fulfilment,
                respond to enquiries, improve our services, prevent misuse,
                and meet applicable legal obligations. Promotional messages
                may be sent where appropriate and subject to applicable
                requirements.
              </p>
            </section>

            {/* Payments */}
            <section id="payments" className={SECTION}>
              <p className={PARA}>
                We use relevant order and transaction information to process
                purchases, verify payment status, and resolve payment-related
                issues. Payments may be handled by third-party payment
                providers, whose own terms and privacy policies may apply to
                information submitted through their services.
              </p>
            </section>

            {/* Sharing */}
            <section id="sharing" className={SECTION}>
              <p className={PARA}>
                We may share relevant information with service providers
                supporting our website, payments, communications, or order
                fulfilment, and where required by law. We do not sell customer
                personal information as a product.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-gray-600 text-justify sm:mt-1 sm:text-[13px]">
                Our website may use cookies, local storage, or analytics tools
                to support essential features and understand website usage,
                where these technologies are enabled. You can manage cookies
                through your browser settings, although some features may be
                affected.
              </p>
            </section>

            {/* Security */}
            <section id="security" className={SECTION}>
              <p className={PARA}>
                We aim to protect personal information through reasonable
                safeguards. No online system can be guaranteed completely
                secure. We retain information for as long as reasonably needed
                to provide our services, maintain appropriate records, resolve
                disputes, and meet legal obligations.
              </p>
            </section>

            {/* Choices */}
            <section id="choices" className={SECTION}>
              <p className={PARA}>
                Subject to applicable law, you may contact us to request
                access to, correction of, or deletion of your personal
                information. We may need to verify your identity before
                processing a request, and some records may need to be retained
                for legal or legitimate business purposes.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className={SECTION}>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-600 sm:text-[13px]">
                If you have questions about this policy or your personal
                information, please contact us.
              </p>

              <div className="mt-4 rounded-xl border border-[#EAD9DC] bg-[#fffbfc] p-4 sm:p-5">
                <h3 className="text-[12px] font-semibold text-gray-600 sm:text-[16px]">
                  GuiltFree Cravings
                </h3>

                <a
                  href="mailto:guiltfreecravings24@gmail.com"
                  className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-gray-600 sm:text-[13px]"
                >
                  <span className="break-all">guiltfreecravings24@gmail.com</span>
                </a>

                <a
                  href="tel:+919667760119"
                  className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-gray-600 sm:text-[13px]"
                >
                  <span className="shrink-0 text-[14px] text-[#824958]">☎</span>
                  +91-9667760119
                </a>

                <p className="mt-2 text-[11px] leading-relaxed text-gray-600 sm:text-[13px]">
                  RZ-E-60, Chanakya Place Part - 1, Dabri, Janakpuri, West,
                  Delhi - 110059
                </p>
              </div>
            </section>
          </div>

          {/* Bottom links */}
          <div className="mt-6 flex flex-col gap-3 border-t border-[#EAD9DC] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-[#EAD9DC] bg-white px-4 py-2.5 text-[12px] text-[#373033] transition-colors hover:text-[#824958] w-full sm:w-auto"
            >
              Return to Home
            </Link>

            <Link
              to="/terms-and-conditions"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#EAD9DC] bg-white px-4 py-2.5 text-[12px] text-[#373033] transition-colors hover:text-[#824958] w-full sm:w-auto"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;