import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  OTP_LENGTH,
} from "./otpAuthUtils";

interface OtpVerificationStepProps {
  phone: string;
  otp: string;
  loading: boolean;
  resendCountdown: number;
  otpInputRef: React.RefObject<HTMLInputElement | null>;
  onOtpChange: (value: string) => void;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
  onBackToPhone: () => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

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
    <div className="mt-8">
      {/* =====================================================
          CHANGE NUMBER
      ====================================================== */}

      <button
        type="button"
        onClick={onBackToPhone}
        disabled={loading}
        className="group inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />

        <span>Change mobile number</span>
      </button>

      {/* =====================================================
          OTP FIELD
      ====================================================== */}

      <div className="relative mt-4">
        {/* =================================================
            HIDDEN ACTUAL INPUT

            Keeps the existing OTP functionality intact
            while displaying separate OTP boxes.
        ================================================== */}

        <input
          ref={otpInputRef}
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) =>
            onOtpChange(event.target.value)
          }
          onKeyDown={onKeyDown}
          maxLength={OTP_LENGTH}
          disabled={loading}
          aria-label="One-time password"
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
        />

        {/* =================================================
            OTP BOXES
        ================================================== */}

        <div
          className="flex w-full items-center justify-center gap-3"
          aria-hidden="true"
        >
          {Array.from({
            length: OTP_LENGTH,
          }).map((_, index) => {
            const digit = otp[index] ?? "";
            const isActive = index === otp.length;

            return (
              <div
                key={index}
                className={`flex h-[50px] w-[50px] items-center justify-center rounded-xl border bg-white text-xl font-semibold text-slate-900 transition-all duration-200 sm:h-[52px] sm:w-[52px] ${
                  isActive
                    ? "border-[#8b542f] ring-2 ring-[#8b542f]/10"
                    : digit
                      ? "border-[#8b542f]"
                      : "border-[#d9c9bb]"
                }`}
              >
                {digit}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          VERIFY
      ====================================================== */}

      <button
        type="button"
        onClick={onVerifyOtp}
        disabled={loading}
        className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-5 text-sm text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#cdb9a8] disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
          </>
        )}
      </button>

      {/* =====================================================
          RESEND
      ====================================================== */}

      <div className="mt-5 flex items-center justify-center gap-2 text-xs">
        <span className="text-slate-400">
          Didn't receive the code?
        </span>

        {resendCountdown > 0 ? (
          <span className=" text-slate-500">
            Resend in {resendCountdown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={onResendOtp}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[#8b542f] transition hover:text-[#744324] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={13} />
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default OtpVerificationStep;