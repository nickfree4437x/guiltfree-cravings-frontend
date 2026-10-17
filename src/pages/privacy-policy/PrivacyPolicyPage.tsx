import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ShieldCheck,
  Database,
  CreditCard,
  LockKeyhole,
  Mail,
  ChevronRight,
  Cookie,
  UserRound,
} from "lucide-react";

function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-16 text-[#211A1C] sm:pt-20 pb-14">
      {/* CENTERED PAGE HEADER */}
      <header className=" bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 text-center sm:px-8 sm:py-12">

          <h1 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-[11px] md:sm:text-[13.5px] leading-relaxed text-slate-700">
            Your privacy matters. Learn how we protect and use your information.
          </p>
        </div>
      </header>

      {/* POLICY CONTENT */}
      <section className="px-4 py-0 sm:px-6 sm:py-0">
        <article className="mx-auto max-w-4xl rounded-2xl border border-[#EAD9DC] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          {/* INTRO */}
          <div className="mb-6 rounded-xl border border-[#F0E3E5] bg-[#fffbfc] p-4 sm:p-5">
            <p className="mt-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
              This policy describes the information we may collect, why we
              use it, and the choices available to you. Our practices depend
              on the services and features you use.
            </p>
            <p className="mt-2 text-xs text-[#62585B]">
              Last updated: 17 October 2026
            </p>
          </div>

          <div className="space-y-4 sm:space-y-8">
            <section id="collection" className="scroll-mt-6">
              <SectionHeading
                icon={<Database size={19} />}
                title="1. Information We Collect"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                When you use our website, we may collect information you
                provide, including:
              </p>
              <ul className="mt-2 space-y-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700">
                <Bullet>
                  <strong className="text-gray-700 text-[12px] md:text-[15px] font-semibold">Contact details:</strong>{" "}
                  Name, phone number, email address, and delivery address.
                </Bullet>
                <Bullet>
                  <strong className="text-gray-700 text-[12px] md:text-[15px] font-semibold">
                    Account and order details:
                  </strong>{" "}
                  Account information, selected products, order history, and
                  order-related communications.
                </Bullet>
                <Bullet>
                  <strong className="text-gray-700 text-[12px] md:text-[15px] font-semibold">
                    Technical information:
                  </strong>{" "}
                  Device, browser, and website usage information where collected.
                </Bullet>
              </ul>
            </section>

            <section id="usage" className="scroll-mt-6">
              <SectionHeading
                icon={<UserRound size={19} />}
                title="2. How We Use Your Information"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                We use relevant information to manage accounts, verify logins
                where applicable, process orders, coordinate fulfilment,
                respond to enquiries, improve our services, prevent misuse,
                and meet applicable legal obligations. Promotional messages
                may be sent where appropriate and subject to applicable
                requirements.
              </p>
            </section>

            <section id="payments" className="scroll-mt-6">
              <SectionHeading
                icon={<CreditCard size={19} />}
                title="3. Orders & Payments"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                We use relevant order and transaction information to process
                purchases, verify payment status, and resolve payment-related
                issues. Payments may be handled by third-party payment
                providers, whose own terms and privacy policies may apply to
                information submitted through their services.
              </p>
            </section>

            <section id="sharing" className="scroll-mt-6">
              <SectionHeading
                icon={<Cookie size={19} />}
                title="4. Information Sharing & Cookies"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                We may share relevant information with service providers
                supporting our website, payments, communications, or order
                fulfilment, and where required by law. We do not sell customer
                personal information as a product.
              </p>
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                Our website may use cookies, local storage, or analytics tools
                to support essential features and understand website usage,
                where these technologies are enabled. You can manage cookies
                through your browser settings, although some features may be
                affected.
              </p>
            </section>

            <section id="security" className="scroll-mt-6">
              <SectionHeading
                icon={<LockKeyhole size={19} />}
                title="5. Security & Data Retention"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                We aim to protect personal information through reasonable
                safeguards. No online system can be guaranteed completely
                secure. We retain information for as long as reasonably needed
                to provide our services, maintain appropriate records, resolve
                disputes, and meet legal obligations.
              </p>
            </section>

            <section id="choices" className="scroll-mt-6">
              <SectionHeading
                icon={<ShieldCheck size={19} />}
                title="6. Your Privacy Choices"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700 text-justify">
                Subject to applicable law, you may contact us to request
                access to, correction of, or deletion of your personal
                information. We may need to verify your identity before
                processing a request, and some records may need to be retained
                for legal or legitimate business purposes.
              </p>
            </section>

            <section id="contact" className="scroll-mt-6">
              <SectionHeading
                icon={<Mail size={19} />}
                title="7. Contact Us"
              />
              <p className="mt-1 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700">
                If you have questions about this policy or your personal
                information, please contact us.
              </p>

              <div className="mt-4 rounded-xl border border-[#EAD9DC] bg-[#fffbfc] p-4 sm:p-5">
                <h3 className="text-[12px] md:text-[16px] font-semibold text-gray-700">
                  GuiltFree Cravings
                </h3>

                <a
                  href="mailto:guiltfreecravings24@gmail.com"
                  className="mt-2 flex items-start gap-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700"
                >
                  <Mail size={17} className="mt-1 shrink-0 text-[#824958]" />
                  <span className="break-all">
                    guiltfreecravings24@gmail.com
                  </span>
                </a>

                <a
                  href="tel:+919667760119"
                  className="mt-2 flex items-start gap-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700"
                >
                  <span className="shrink-0 text-[#824958]">☎</span>
                  +91-9667760119
                </a>

                <p className="mt-2 text-[11px] md:sm:text-[13px] leading-relaxed text-gray-700">
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
                text-[12px] text-[#373033]
                hover:text-[#824958]
                w-full sm:w-auto
                "
            >
                Return to Home
            </Link>

            <Link
                to="/terms-and-conditions"
                className="
                inline-flex items-center justify-center gap-1
                rounded-lg border border-[#EAD9DC] bg-white
                px-4 py-2.5
                text-[12px] text-[#373033] hover:text-[#824958]
                w-full sm:w-auto
                "
            >
                Terms &amp; Conditions
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
  title: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <h2 className="pt-1 text-[16px] font-semibold leading-snug text-gray-700 sm:text-[18px]">
        {title}
      </h2>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9788B]" />
      <span>{children}</span>
    </li>
  );
}

export default PrivacyPolicyPage;