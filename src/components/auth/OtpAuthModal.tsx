import {
  X,
} from "lucide-react";

import OtpAuthBrandPanel from "./OtpAuthBrandPanel";
import OtpAuthHeader from "./OtpAuthHeader";
import OtpPhoneStep from "./OtpPhoneStep";
import OtpVerificationStep from "./OtpVerificationStep";
import { useOtpAuth } from "./useOtpAuth";

interface OtpAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function OtpAuthModal({
  onClose,
  onSuccess,
}: OtpAuthModalProps) {
  const {
    step,
    phone,
    otp,
    loading,
    error,
    resendCountdown,
    otpInputRef,

    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToPhone,
    handlePhoneChange,
    handleOtpChange,
    handleKeyDown,
  } = useOtpAuth({
    onSuccess,
  });

  // ==========================================================
  // BACKDROP CLICK
  // ==========================================================

  const handleBackdropMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (loading) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-[3px] sm:px-6"
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      {/* ====================================================
          MODAL
      ===================================================== */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-auth-title"
        className="relative flex max-h-[calc(100vh-40px)] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-sm sm:max-h-[calc(100vh-56px)] lg:min-h-[550px]"
      >
        {/* ==================================================
            CLOSE BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd3] bg-white/95 text-slate-500 shadow-sm transition hover:border-[#cdb8a6] hover:bg-white hover:text-[#8b542f] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:right-5 lg:top-5"
        >
          <X size={15} />
        </button>

        {/* ==================================================
            LEFT BRAND PANEL
        =================================================== */}

        <OtpAuthBrandPanel />

        {/* ==================================================
            RIGHT AUTH PANEL
        =================================================== */}

        <section className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
          <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col px-6 py-5 sm:px-9 sm:py-6 lg:px-11 lg:py-8">
            {/* =================================================
                MOBILE BRAND
            ================================================== */}

            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e4d3] text-[#8b542f]">
                <span className="text-sm font-bold">
                  G
                </span>
              </div>

              <div>
                <p className="text-xs font-bold tracking-[0.08em] text-[#8b542f]">
                  GUILTFREE CRAVINGS
                </p>

                <p className="text-[10px] text-slate-400">
                  Good food. Made honestly.
                </p>
              </div>
            </div>

            {/* =================================================
                HEADER
            ================================================== */}

            <div id="otp-auth-title">
              <OtpAuthHeader step={step} />
            </div>

            {/* =================================================
                PHONE STEP
            ================================================== */}

            {step === "phone" && (
              <OtpPhoneStep
                phone={phone}
                error={error}
                loading={loading}
                onPhoneChange={handlePhoneChange}
                onSendOtp={handleSendOtp}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* =================================================
                OTP STEP
            ================================================== */}

            {step === "otp" && (
              <OtpVerificationStep
                phone={phone}
                otp={otp}
                loading={loading}
                resendCountdown={
                  resendCountdown
                }
                otpInputRef={otpInputRef}
                onOtpChange={handleOtpChange}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                onBackToPhone={
                  handleBackToPhone
                }
                onKeyDown={handleKeyDown}
              />
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-auto pt-8">
              <div className="border-t border-[#eee5de] pt-5">
                <p className="text-center text-[10px] font-[350] leading-5 text-slate-400 sm:text-[11px]">
                  By continuing, you agree to our{" "}
                  <span className="text-[#8b542f]">
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span className="text-[#8b542f]">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OtpAuthModal;