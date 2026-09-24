import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Choose your favourite laddoo, select the size and packaging you prefer, add it to your cart, and complete checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "You can use the available payment options shown during checkout to securely complete your order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been processed and shipped, the available order tracking details will be shared with you.",
  },
  {
    question: "Can I cancel or change my order?",
    answer:
      "If you need to change or cancel an order, please contact us as soon as possible with your order number so our team can check the order status.",
  },
  {
    question: "How should I store my laddoos?",
    answer:
      "Keep your laddoos sealed and store them according to the storage instructions provided with your order.",
  },
  {
    question: "What should I do if there is a problem with my order?",
    answer:
      "Use the Order Support form and share your order number along with the issue. Our team can review the details and assist you.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">

      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FBEEF1]/50 blur-[70px]" />

      {/* ================= CONTENT ================= */}
      <div className="relative p-5 sm:p-7">

        {/* ================= MINI HEADER ================= */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBEEF1]">
              <HelpCircle
                className="h-5 w-5 text-[#B5697A]"
                strokeWidth={2}
              />
            </span>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5697A]">
                FAQs
              </p>
              <h3 className="mt-0.5 text-[18px] font-semibold leading-tight text-[#1F4A2E] sm:text-[20px]">
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

        {/* ================= FAQ LIST ================= */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  group relative overflow-hidden rounded-xl
                  border transition-all duration-300
                  ${
                    isOpen
                      ? "border-[#B5697A]/40 bg-[#FFFCF7]"
                      : "border-[#EFE3D2] bg-white hover:bg-[#FFFCF7]"
                  }
                `}
              >
                {/* Question button */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  className="
                    flex w-full items-center justify-between
                    gap-3 px-4 py-3.5 text-left
                    sm:px-5 sm:py-4
                  "
                >
                  <span
                    className={`
                      text-[14px] font-semibold leading-tight
                      transition-colors duration-300
                      ${isOpen ? "text-[#B5697A]" : "text-[#1F4A2E] group-hover:text-[#B5697A]"}
                      sm:text-[15.5px]
                    `}
                  >
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`
                      h-4 w-4 shrink-0 transition-all duration-300
                      ${isOpen ? "rotate-180 text-[#B5697A]" : "text-[#8B7A6C] group-hover:text-[#B5697A]"}
                      sm:h-[18px] sm:w-[18px]
                    `}
                    strokeWidth={2.2}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`
                    grid transition-all duration-300 ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-4 pb-4 text-[12.5px] leading-[1.5] text-[#2c2c2c] sm:px-5 sm:pb-5 sm:text-[13.5px] sm:leading-[1.5]">
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