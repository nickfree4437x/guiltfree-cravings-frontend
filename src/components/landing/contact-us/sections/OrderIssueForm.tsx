
import { useState, type FormEvent } from "react";
import {
  Send,
  ChevronDown,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/authStore";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedOrderNumber = orderNumber.trim();
    const normalizedMessage = message.trim();

    if (
      !normalizedOrderNumber ||
      !issueType ||
      !normalizedMessage
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (normalizedMessage.length < 10) {
      toast.error(
        "Please describe your issue in at least 10 characters."
      );
      return;
    }

    if (!token) {
      toast.error("Please log in to report an order issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiBaseUrl = (
        import.meta.env.VITE_API_BASE_URL ||
        "https://guiltfreecravings.com/api"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${apiBaseUrl}/order-issues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderNumber: normalizedOrderNumber,
            issueType,
            message: normalizedMessage,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to submit your issue. Please try again."
        );
      }

      // Show success toast
      toast.success(
        result.message ||
          "Your issue has been submitted successfully."
      );

      // Reset form only after successful submission
      setOrderNumber("");
      setIssueType("");
      setMessage("");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-gray-200 bg-transparent px-5 py-5 sm:px-7 sm:py-7">
      {/* MINI HEADER */}
      <div className="relative mb-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5C5CC] bg-transparent">
            <AlertCircle
              className="h-[18px] w-[18px] text-[#B5697A]"
              strokeWidth={1.8}
            />
          </span>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5697A]">
              Order Support
            </p>

            <h3 className="mt-0.5 text-[16px] font-semibold leading-tight text-gray-600 sm:text-[18px]">
              Something not quite right?
            </h3>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="h-px w-8 bg-[#B5697A]/40" />
          <span className="h-1 w-1 rounded-full bg-[#B5697A]" />
          <span className="h-px flex-1 bg-[#EADBD0]" />
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="relative space-y-5"
      >
        {/* ORDER NUMBER */}
        <div>
          <input
            id="order-number"
            name="orderNumber"
            type="text"
            value={orderNumber}
            onChange={(event) =>
              setOrderNumber(event.target.value)
            }
            placeholder="Enter your order number"
            autoComplete="off"
            maxLength={100}
            className="h-11 w-full rounded-lg border border-[#E5D7CB] bg-transparent px-3.5 text-[13px] text-gray-600 font-[350] outline-none transition-all duration-200 placeholder:text-gray-500 placeholder:font-[350] hover:border-[#D5C3B5] focus:border-[#B5697A]"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* ISSUE TYPE */}
        <div>
          <div className="relative">
            <select
              id="issue-type"
              name="issueType"
              value={issueType}
              onChange={(event) =>
                setIssueType(event.target.value)
              }
              className={`h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#E5D7CB] bg-transparent pl-3.5 pr-10 text-[13px] outline-none transition-all duration-200 hover:border-[#D5C3B5] focus:border-[#B5697A] ${
                issueType
                  ? "text-gray-600 font-[350]"
                  : "text-gray-500 font-[350]"
              }`}
              required
              disabled={isSubmitting}
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
            name="message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Please share the details of the issue..."
            rows={5}
            minLength={10}
            maxLength={500}
            className="w-full resize-none rounded-lg font-[350] border border-[#E5D7CB] bg-transparent px-3.5 py-3 text-[13px] leading-[1.6] text-gray-600 outline-none transition-all duration-200 placeholder:text-gray-500 placeholder:font-[350] hover:border-[#D5C3B5] focus:border-[#B5697A]"
            required
            disabled={isSubmitting}
          />

          <p className="mt-1 text-right text-[11px] font-[350] text-[#8B7A6C]">
            {message.length}/500
          </p>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group/cta relative h-11 w-full overflow-hidden rounded-lg bg-[#B5697A] px-5 font-[350] text-[13px] tracking-wide text-white transition-all duration-300 hover:bg-[#A55F70] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/50 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13.5px]"
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send
                  className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5"
                  strokeWidth={2.2}
                />
                Report an Issue
              </>
            )}
          </span>

          {!isSubmitting && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
            />
          )}
        </button>
      </form>
    </div>
  );
}

export default OrderIssueForm;
