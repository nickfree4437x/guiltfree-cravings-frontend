import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
interface FAQItem {
  question: string;
  answer: string;
}

// ─── Static Data ──────────────────────────────────────────
const FAQS: FAQItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Method 1, Website: browse products, add to cart, click the cart, log in (or quick-register) and pay. Method 2, QR code: scan the QR on our printed catalogue or WhatsApp messages, the digital catalogue opens, select items, log in (or quick-register) and pay. Delivery: within 24 to 48 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "You can securely complete your order using the available payment options at checkout, including Cash on Delivery (COD) and UPI.",
  },
  {
    question: "How can I track my order?",
    answer:
      "WhatsApp alerts: once dispatched, a tracking link comes by email and WhatsApp. Website account: log in, go to “My Orders”, click the active order for live delivery updates.",
  },
  {
    question: "Can I cancel or change my order?",
    answer:
      "Yes. You can cancel or modify your order within 1 hour of placing it. After 1 hour, processing begins in our kitchen and changes are no longer possible.",
  },
  {
    question: "How should I store my laddoos?",
    answer:
      "All products need to be stored at room temperature, not in the refrigerator. For product-specific shelf life, please click on the product you want to buy.",
  },
  {
    question: "What should I do if there is a problem with my order?",
    answer:
      "Use the Order Support form and share your order number along with the issue. Our team can review the details and assist you.",
  },
];

// ─── Component ────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div id="faq" className="relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white scroll-mt-20">
      <div className="relative p-5 sm:p-7">
        {/* Mini header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBEEF1]">
              <HelpCircle className="h-5 w-5 text-[#B5697A]" strokeWidth={2} />
            </span>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5697A]">FAQs</p>
              <h3 className="mt-0.5 text-[16px] font-semibold leading-tight text-gray-600 sm:text-[18px]">
                Frequently asked questions
              </h3>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#B5697A]/40" />
            <span className="h-1 w-1 rounded-full bg-[#B5697A]" />
            <span className="h-px flex-1 bg-gradient-to-r from-[#B5697A]/30 to-transparent" />
          </div>
        </div>

        {/* FAQ list */}
        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white"
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-300 sm:px-5 sm:py-3 ${
                    isOpen ? "bg-[#fffbfc]" : "bg-white hover:bg-[#fffbfc]"
                  }`}
                >
                  <span className="pr-4 text-[13px] text-gray-600 sm:text-[15px]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-all duration-300 sm:h-[18px] sm:w-[18px] ${
                      isOpen
                        ? "rotate-180 text-[#B5697A]"
                        : "text-[#8B7A6C] group-hover:text-[#B5697A]"
                    }`}
                    strokeWidth={2.2}
                  />
                </button>

                {/* Answer (grid-rows collapse trick) */}
                <div
                  className={`grid bg-white transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden bg-white">
                    <p className="mt-1 bg-white px-4 pb-4 text-justify text-[12px] font-[350] leading-relaxed text-gray-600 sm:px-5 sm:text-[13px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FAQSection;