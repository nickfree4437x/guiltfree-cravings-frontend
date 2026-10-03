import {
  X,
} from "lucide-react";

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
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-[#2C2226]/45
        px-4 py-5
        backdrop-blur-[4px]
        sm:px-6
      "
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
        className="
          relative
          flex w-full max-w-[460px]
          max-h-[calc(100vh-40px)]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-[#F0E3E6]
          bg-white
          shadow-sm
          animate-[otpModalIn_220ms_ease-out]
          sm:max-h-[calc(100vh-64px)]
        "
      >
        {/* ==================================================
            CLOSE BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication"
          className="
            absolute right-4 top-4 z-30
            flex h-8 w-8 md:h-9 md:w-9
            items-center justify-center
            rounded-full
            border border-[#EEE1E4]
            bg-white
            text-[#9A8D90]
            shadow-sm
            hover:border-[#DDBCC5]
            hover:bg-[#FFF7F9]
            hover:text-[#B5697A]
            focus:outline-none
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:right-5 sm:top-5
          "
        >
          <X
            size={15}
            strokeWidth={1.8}
          />
        </button>

        {/* ==================================================
            AUTH PANEL
        =================================================== */}

        <section
          className="
            flex min-h-0
            w-full flex-1
            flex-col
            overflow-y-auto
            bg-white
          "
        >
          <div
            className="
              mx-auto
              flex w-full max-w-[420px]
              flex-1 flex-col
              px-6 py-7
              sm:px-8 sm:py-8
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
              id="otp-auth-title"
              className="pr-8"
            >
              <OtpAuthHeader step={step} />
            </div>

            {/* =================================================
                CONTENT
            ================================================== */}

            <div className="mt-5 flex-1 sm:mt-8">
              {/* ===============================================
                  PHONE STEP
              ================================================ */}

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

              {/* ===============================================
                  OTP STEP
              ================================================ */}

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
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div
              className="
                mt-8
                border-t border-[#F1E5E8]
                pt-5
              "
            >
              <p
                className="
                  text-center
                  text-[10px]
                  leading-relaxed
                  text-[#A49A9C]
                  sm:text-[11px]
                "
              >
                By continuing, you agree to our{" "}
                <span className="text-[#B5697A]">
                  Terms of Use
                </span>{" "}
                and{" "}
                <span className="text-[#B5697A]">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OtpAuthModal;