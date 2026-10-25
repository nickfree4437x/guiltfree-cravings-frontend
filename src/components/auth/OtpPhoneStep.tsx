import toast from "react-hot-toast";
import type { KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────
interface OtpPhoneStepProps {
  phone: string;
  loading: boolean;
  error: string;
  onPhoneChange: (value: string) => void;
  onSendOtp: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// ─── Component ────────────────────────────────────────────
function OtpPhoneStep({
  phone,
  loading,
  error,
  onPhoneChange,
  onSendOtp,
  onKeyDown,
}: OtpPhoneStepProps) {
  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = () => {
    if (loading) return;
    if (!phone.trim()) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (!isValidPhone) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    onSendOtp();
  };

  // NOTE: Toast during render (preserved as-is from original)
  if (error) {
    toast.error(error);
  }

  return (
    <div className="w-full">
      {/* Phone field */}
      <div
        className={`flex h-[40px] w-full overflow-hidden rounded-lg border bg-white transition-all duration-200 ${
          phone.length > 0 && isValidPhone
            ? "border-[#D4AAB4] bg-[#FFFBFC]"
            : "border-[#E8DCDF] focus-within:border-[#B5697A] focus-within:ring-[#B5697A]/10"
        } ${loading ? "opacity-70" : ""}`}
      >
        {/* Country code */}
        <div className="flex shrink-0 items-center border-r border-[#EDE1E4] bg-[#FFFBFC] px-3.5 sm:px-4">
          <span className="text-[12px] font-semibold tracking-[-0.01em] text-gray-600 sm:text-[13px]">
            +91
          </span>
        </div>

        {/* Phone input */}
        <input
          id="auth-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter mobile number"
          maxLength={10}
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent px-3.5 text-[12px] text-[#2C2C2C] outline-none placeholder:font-[350] placeholder:text-slate-500 disabled:cursor-not-allowed sm:px-4 sm:text-[14px]"
          aria-label="Phone Number"
        />
      </div>

      {/* Helper text */}
      <p className="mt-2 max-w-[390px] text-center text-[10px] leading-relaxed text-gray-600 sm:text-[11px]">
        Your number is safe and used only for secure login
      </p>

      {/* Continue button */}
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={loading}
        className="mt-5 flex h-[44px] w-full items-center justify-center gap-2 font-[400] rounded-xl bg-[#B5697A] px-5 text-[13.5px] text-white hover:bg-[#A85D6F] hover:shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:bg-[#D7AEB8] disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            <span>Sending OTP...</span>
          </>
        ) : (
          <span>Continue</span>
        )}
      </button>
    </div>
  );
}

export default OtpPhoneStep;