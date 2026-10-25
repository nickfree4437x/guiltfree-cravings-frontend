import { RefreshCw } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";

import { OTP_LENGTH } from "./otpAuthUtils";

// ─── Types ────────────────────────────────────────────────
interface OtpVerificationStepProps {
  phone: string;
  otp: string;
  loading: boolean;
  resendCountdown: number;
  otpInputRef: RefObject<HTMLInputElement | null>;
  onOtpChange: (value: string) => void;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
  onBackToPhone: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// ─── Component ────────────────────────────────────────────
function OtpVerificationStep({
  otp,
  loading,
  resendCountdown,
  otpInputRef,
  onOtpChange,
  onVerifyOtp,
  onResendOtp,
  onBackToPhone,
  onKeyDown,
}: OtpVerificationStepProps) {
  return (
    <div className="w-full">
      {/* Change number */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onBackToPhone}
          disabled={loading}
          className="group inline-flex items-center gap-1.5 text-[11px] text-gray-600 transition-colors duration-200 hover:text-[#B5697A] hover:underline focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Change mobile number</span>
        </button>
      </div>

      {/* OTP field */}
      <div className="relative mt-4">
        {/* Hidden actual input (keeps functionality while showing custom boxes) */}
        <input
          ref={otpInputRef}
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={OTP_LENGTH}
          disabled={loading}
          aria-label="One-time password"
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
        />

        {/* OTP boxes */}
        <div
          className="flex w-full items-center justify-center gap-2 sm:gap-2.5"
          aria-hidden="true"
        >
          {Array.from({ length: OTP_LENGTH }).map((_, index) => {
            const digit = otp[index] ?? "";
            const isActive = index === otp.length;

            return (
              <div
                key={index}
                className={`flex h-[45px] w-[45px] items-center justify-center rounded-[12px] border bg-white text-[16px] font-semibold tracking-wide text-[#2C2C2C] transition-all duration-200 sm:h-[50px] sm:w-[50px] sm:text-[18px] ${
                  isActive
                    ? "border-[#B5697A] bg-[#FFFBFC]"
                    : digit
                      ? "border-[#D9B4BD] bg-[#FFFBFC]"
                      : "border-[#E8DCDF]"
                } ${loading ? "opacity-70" : ""}`}
              >
                {digit}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verify button */}
      <button
        type="button"
        onClick={onVerifyOtp}
        disabled={loading}
        className="mt-6 flex h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 text-[13px] text-white hover:bg-[#A85D6F] hover:shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:bg-[#D7AEB8] disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            <span>Verifying...</span>
          </>
        ) : (
          <span>Verify & Continue</span>
        )}
      </button>

      {/* Resend */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]">
        <span className="text-slate-500">Didn't receive the code?</span>

        {resendCountdown > 0 ? (
          <span className="text-slate-500">Resend in {resendCountdown}s</span>
        ) : (
          <button
            type="button"
            onClick={onResendOtp}
            disabled={loading}
            className="inline-flex items-center gap-1.5 hover:underline text-[#B5697A] transition-colors duration-200 hover:text-[#A85D6F] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={12} strokeWidth={2} />
            <span>Resend OTP</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default OtpVerificationStep;