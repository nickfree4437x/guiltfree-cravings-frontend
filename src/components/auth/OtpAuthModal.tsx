import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  sendOtp,
  verifyOtp,
} from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";

interface OtpAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type AuthStep = "phone" | "otp";

const RESEND_COOLDOWN_SECONDS = 60;

function OtpAuthModal({
  onClose,
  onSuccess,
}: OtpAuthModalProps) {
  const login = useAuthStore(
    (state) => state.login
  );

  const [step, setStep] =
    useState<AuthStep>("phone");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [resendCountdown, setResendCountdown] =
    useState(0);

  const otpInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * =========================================================
   * RESEND COUNTDOWN
   * =========================================================
   */

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown(
        (current) => Math.max(0, current - 1)
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendCountdown]);

  /*
   * =========================================================
   * FOCUS OTP INPUT
   * =========================================================
   */

  useEffect(() => {
    if (step === "otp") {
      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  /*
   * =========================================================
   * PHONE NORMALIZATION
   * =========================================================
   */

  const normalizedPhone =
    phone.replace(/\D/g, "");

  /*
   * =========================================================
   * SEND OTP
   * =========================================================
   */

  const handleSendOtp = async () => {
    setError("");

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    try {
      setLoading(true);

      await sendOtp(normalizedPhone);

      setStep("otp");
      setOtp("");
      setResendCountdown(
        RESEND_COOLDOWN_SECONDS
      );
    } catch (err: any) {
      console.error(
        "Failed to send OTP:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * VERIFY OTP
   * =========================================================
   */

  const handleVerifyOtp = async () => {
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const result = await verifyOtp(
        normalizedPhone,
        otp
      );

      /*
       * Save JWT + user
       */
      login(
        result.token,
        result.user
      );

      /*
       * Close modal + continue checkout
       */
      onSuccess();
    } catch (err: any) {
      console.error(
        "Failed to verify OTP:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Invalid OTP. Please try again.";

      setError(message);

      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * RESEND OTP
   * =========================================================
   */

  const handleResendOtp = async () => {
    if (
      resendCountdown > 0 ||
      loading
    ) {
      return;
    }

    setError("");

    try {
      setLoading(true);

      await sendOtp(normalizedPhone);

      setOtp("");

      setResendCountdown(
        RESEND_COOLDOWN_SECONDS
      );
    } catch (err: any) {
      console.error(
        "Failed to resend OTP:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to resend OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * BACK TO PHONE
   * =========================================================
   */

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  /*
   * =========================================================
   * OTP INPUT
   * =========================================================
   */

  const handleOtpChange = (
    value: string
  ) => {
    const numericValue =
      value.replace(/\D/g, "");

    setOtp(
      numericValue.slice(0, 6)
    );

    setError("");
  };

  /*
   * =========================================================
   * ENTER KEY
   * =========================================================
   */

  const handleKeyDown = (
    event: React.KeyboardEvent
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    if (step === "phone") {
      handleSendOtp();
    }

    if (step === "otp") {
      handleVerifyOtp();
    }
  };

  /*
   * =========================================================
   * MODAL
   * =========================================================
   */

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-auth-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-[#fffaf5] shadow-2xl">

        {/* =====================================================
            CLOSE BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-[#f5eadf] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close login"
        >
          ×
        </button>

        <div className="p-7 sm:p-9">

          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="pr-8">

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Secure Checkout
            </span>

            <h2
              id="otp-auth-title"
              className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              {step === "phone"
                ? "Login or Register"
                : "Verify Your Number"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {step === "phone"
                ? "Enter your mobile number to continue securely with your order."
                : `We've sent a 6-digit OTP to +91 ${normalizedPhone}.`}
            </p>

          </div>

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* ===================================================
              PHONE STEP
          =================================================== */}

          {step === "phone" && (
            <div className="mt-7">

              <label
                htmlFor="phone"
                className="text-sm font-semibold text-slate-800"
              >
                Mobile Number
              </label>

              <div className="mt-2 flex overflow-hidden rounded-2xl border border-[#d9c7b7] bg-white transition focus-within:border-[#8b542f] focus-within:ring-2 focus-within:ring-[#8b542f]/10">

                <span className="flex items-center border-r border-[#e5d9cf] px-4 text-sm font-semibold text-slate-500">
                  +91
                </span>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => {
                    setPhone(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      ).slice(0, 10)
                    );

                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter mobile number"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={loading}
                />

              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  loading ||
                  normalizedPhone.length !== 10
                }
                className="mt-5 w-full rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                We'll use this number to securely
                verify your account and continue
                your checkout.
              </p>

            </div>
          )}

          {/* ===================================================
              OTP STEP
          =================================================== */}

          {step === "otp" && (
            <div className="mt-7">

              <label
                htmlFor="otp"
                className="text-sm font-semibold text-slate-800"
              >
                Enter OTP
              </label>

              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  handleOtpChange(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="000000"
                className="mt-2 w-full rounded-2xl border border-[#d9c7b7] bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.45em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
                disabled={loading}
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="mt-5 w-full rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading
                  ? "Verifying..."
                  : "Verify & Continue"}
              </button>

              {/* Resend */}

              <div className="mt-5 text-center">

                {resendCountdown > 0 ? (
                  <p className="text-sm text-slate-400">
                    Resend OTP in{" "}
                    <span className="font-semibold text-slate-600">
                      {resendCountdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm font-semibold text-[#8b542f] underline underline-offset-4 transition hover:text-[#744324] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}

              </div>

              {/* Change Number */}

              <button
                type="button"
                onClick={handleBackToPhone}
                disabled={loading}
                className="mt-4 block w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Change mobile number
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OtpAuthModal;