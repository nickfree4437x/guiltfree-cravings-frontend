import { useState } from "react";
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

const issueTypes = [
  "Order not received",
  "Wrong item received",
  "Damaged product",
  "Missing item",
  "Payment issue",
  "Other",
];

function OrderIssueForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!orderNumber.trim() || !issueType || !message.trim()) {
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setOrderNumber("");
    setIssueType("");
    setMessage("");
  };

  /* =========================================================
     SUCCESS STATE
  ========================================================= */
  if (submitted) {
    return (
      <div className="relative h-full overflow-hidden rounded-3xl border border-[#DDE9DF] bg-white p-6 shadow-sm sm:p-8">

        {/* Corner blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EAF3EC]/70 blur-[70px]" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#FBEEF1]/50 blur-[70px]" />

        <Sparkles
          className="absolute right-5 top-5 h-4 w-4 text-[#B5697A]/40"
          strokeWidth={1.6}
        />

        <div className="relative flex h-full flex-col items-center justify-center py-6 text-center">

          {/* Success icon with pulse ring */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#EAF3EC]" />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-[#1F4A2E]/20"
              style={{ animation: "pulseRing 2s ease-out infinite" }}
            />
            <CheckCircle2
              size={30}
              strokeWidth={1.9}
              className="relative z-10 text-[#1F4A2E]"
            />
          </div>

          <h3 className="mt-6 font-serif text-[22px] font-semibold leading-tight text-[#1F4A2E] sm:text-[24px]">
            We&apos;ve received{" "}
            <span className="italic text-[#B5697A]">your request.</span>
          </h3>

          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#B5697A]/40" />
            <span className="h-1 w-1 rounded-full bg-[#B5697A]" />
            <span className="h-px w-6 bg-[#B5697A]/40" />
          </div>

          <p className="mt-5 max-w-sm text-[13px] leading-[1.7] text-[#7A6A5C] sm:text-[13.5px]">
            Our team will review the details and get back to you
            regarding your order{" "}
            <span className="font-semibold text-[#1F4A2E]">
              within 24 hours.
            </span>
          </p>

          <button
            type="button"
            onClick={handleReset}
            className="
              mt-7 inline-flex items-center gap-2 rounded-full
              border border-[#B5697A]/30 bg-white px-5 py-2.5
              text-[12px] font-semibold text-[#B5697A]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-[#B5697A]
              hover:bg-[#FBEEF1]
              sm:text-[12.5px]
            "
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Report another issue
          </button>
        </div>

        <style>
          {`
            @keyframes pulseRing {
              0%   { transform: scale(1);   opacity: 0.6; }
              100% { transform: scale(1.6); opacity: 0; }
            }
          `}
        </style>
      </div>
    );
  }

  /* =========================================================
     FORM STATE
  ========================================================= */
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-[0_20px_50px_-24px_rgba(139,111,92,0.15)] sm:p-7">


      {/* Corner accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FBEEF1]/50 blur-[70px]" />

      {/* ================= MINI HEADER ================= */}
      <div className="relative mb-6">

        {/* Icon + Label */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBEEF1]">
            <AlertCircle
              className="h-4.5 w-4.5 text-[#B5697A]"
              strokeWidth={2}
            />
          </span>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5697A]">
              Order Support
            </p>
            <h3 className="mt-0.5 text-[18px] font-semibold leading-tight text-[#1F4A2E] sm:text-[20px]">
              Something not quite right?
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

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="relative space-y-4">

        {/* ORDER NUMBER */}
        <div>

          <input
            id="order-number"
            type="text"
            value={orderNumber}
            onChange={(event) =>
              setOrderNumber(event.target.value)
            }
            placeholder="Order Number"
            className="
              mt-2 h-11 w-full rounded-xl border border-[#EFE3D2]
              bg-[#FFFCF7] px-3.5 text-[14px] text-[#2C2C2C]
              outline-none transition-all duration-200
              placeholder:text-[#B6A99D]
              hover:border-[#DCCFC3]
              focus:border-[#B5697A]
              focus:bg-white
            "
            required
          />
        </div>

        {/* ISSUE TYPE */}
        <div>

          <div className="relative mt-2">
            <select
              id="issue-type"
              value={issueType}
              onChange={(event) =>
                setIssueType(event.target.value)
              }
              className="
                h-11 w-full appearance-none rounded-xl
                border border-[#EFE3D2] bg-[#FFFCF7]
                pl-3.5 pr-10 text-[14px] text-[#2C2C2C]
                outline-none transition-all duration-200
                hover:border-[#DCCFC3]
                focus:border-[#B5697A]
                focus:bg-white
                cursor-pointer
              "
              required
            >
              <option value="" disabled>
                Select an issue
              </option>

              {issueTypes.map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7A6C]"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div>

          <textarea
            id="issue-message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Please share the details of the issue..."
            rows={5}
            maxLength={500}
            className="
              mt-2 w-full resize-none rounded-xl
              border border-[#EFE3D2] bg-[#FFFCF7]
              px-3.5 py-3 text-[14px] leading-[1.6] text-[#2C2C2C]
              outline-none transition-all duration-200
              placeholder:text-[#B6A99D]
              hover:border-[#DCCFC3]
              focus:border-[#B5697A]
              focus:bg-white
            "
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="
            group/cta relative h-11 w-full overflow-hidden
            rounded-xl bg-[#B5697A]
            px-5 text-[13px] tracking-wide text-white
            transition-all duration-300
            hover:bg-[#A55F70]
            hover:shadow-sm
            focus:outline-none
            sm:text-[13.5px]
          "
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Send
              className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5"
              strokeWidth={2.2}
            />
            Report an Issue
          </span>

          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 -translate-x-full
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              transition-transform duration-700
              group-hover/cta:translate-x-full
            "
          />
        </button>

      </form>
    </div>
  );
}

export default OrderIssueForm;