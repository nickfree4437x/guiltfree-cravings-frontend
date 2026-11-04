import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-white pb-12 lg:pb-14">
    

      <div className="mx-auto w-full max-w-6xl px-4 py-0 sm:px-6 sm:py-0">
        
        {/* =====================================================
            INTRO BANNER (Same as Transactions Page)
        ===================================================== */}
        <section className="relative overflow-hidden rounded-xl bg-[#B5697A] p-5 shadow-sm sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-white/[0.06]" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.10em] text-white/90">
                Your Privacy Matters
              </p>

              <h2 className="mt-1 text-[18px] font-semibold text-white sm:text-[22px]">
                Privacy Policy
              </h2>

              <p className="mt-0 text-[10px] leading-relaxed text-white/75">
                Learn how we protect and use your data.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            POLICY CONTENT (Card)
        ===================================================== */}
        <section className="mt-6">
          <article className="rounded-xl border border-[#F0DDE2] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            
            {/* Intro */}
            <div className="mb-6 rounded-xl border border-[#F0E3E5] bg-[#fffbfc] p-4 sm:p-5">
              <p className="mt-2 text-[11px] leading-relaxed text-gray-600 text-justify sm:text-[12.5px]">
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
      </div>
    </main>
  );
}

export default PrivacyPolicyPage;