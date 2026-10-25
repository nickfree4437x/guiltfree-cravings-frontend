import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MouseEvent } from "react";

import OtpAuthHeader from "./OtpAuthHeader";
import OtpPhoneStep from "./OtpPhoneStep";
import OtpVerificationStep from "./OtpVerificationStep";
import { useOtpAuth } from "./useOtpAuth";

// ─── Types ────────────────────────────────────────────────
interface OtpAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────
function OtpAuthModal({ onClose, onSuccess }: OtpAuthModalProps) {
  const {
    step, phone, otp, loading, error, resendCountdown, otpInputRef,
    handleSendOtp, handleVerifyOtp, handleResendOtp,
    handleBackToPhone, handlePhoneChange, handleOtpChange, handleKeyDown,
  } = useOtpAuth({ onSuccess });

  // Backdrop click (skip if loading)
  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (event.target === event.currentTarget) onClose();
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-5 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 bg-[#2C2226]/45 backdrop-blur-[4px]"
          onMouseDown={handleBackdropMouseDown}
          role="presentation"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-auth-title"
          className="relative flex w-full max-w-[460px] max-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-2xl border border-[#F0E3E6] bg-white shadow-2xl shadow-black/10 sm:max-h-[calc(100vh-64px)]"
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close authentication"
            className="absolute right-4 top-4 z-30 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-[#EEE1E4] bg-white text-[#9A8D90] shadow-sm transition-colors duration-200 hover:border-[#DDBCC5] hover:bg-[#FFF7F9] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:right-5 sm:top-5"
          >
            <X size={15} strokeWidth={1.8} />
          </button>

          {/* Auth panel */}
          <section className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-white">
            <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-6 py-7 sm:px-8 sm:py-8">
              {/* Header */}
              <div id="otp-auth-title" className="pr-8">
                <OtpAuthHeader step={step} />
              </div>

              {/* Content */}
              <div className="mt-5 flex-1 sm:mt-8">
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

                {step === "otp" && (
                  <OtpVerificationStep
                    phone={phone}
                    otp={otp}
                    loading={loading}
                    resendCountdown={resendCountdown}
                    otpInputRef={otpInputRef}
                    onOtpChange={handleOtpChange}
                    onVerifyOtp={handleVerifyOtp}
                    onResendOtp={handleResendOtp}
                    onBackToPhone={handleBackToPhone}
                    onKeyDown={handleKeyDown}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 border-t border-[#F1E5E8] pt-4">
                <p className="text-center text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
                  By continuing, you agree to our{" "}
                  <span className="text-[#B5697A]">Terms of Use</span> and{" "}
                  <span className="text-[#B5697A]">Privacy Policy</span>.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default OtpAuthModal;