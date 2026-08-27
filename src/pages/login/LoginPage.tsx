import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  sendOtp,
  verifyOtp,
} from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";

/*
 * =========================================================
 * LOGIN STEP
 * =========================================================
 */

type LoginStep = "phone" | "otp";

/*
 * =========================================================
 * LOGIN PAGE
 * =========================================================
 */

function LoginPage() {
  const navigate = useNavigate();

  /*
   * =======================================================
   * AUTH STORE
   * =======================================================
   */

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const login = useAuthStore(
    (state) => state.login
  );

  /*
   * =======================================================
   * FORM STATE
   * =======================================================
   */

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  /*
   * =======================================================
   * LOGIN FLOW STATE
   * =======================================================
   */

  const [step, setStep] =
    useState<LoginStep>("phone");

  const [isSendingOtp, setIsSendingOtp] =
    useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] =
    useState(false);

  /*
   * =======================================================
   * OTP TIMER
   * =======================================================
   */

  const [countdown, setCountdown] =
    useState(0);

  /*
   * =======================================================
   * ERROR / SUCCESS
   * =======================================================
   */

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /*
   * =======================================================
   * OTP INPUT REF
   * =======================================================
   */

  const otpInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * =======================================================
   * REDIRECT IF ALREADY AUTHENTICATED
   * =======================================================
   */

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /*
   * =======================================================
   * OTP COUNTDOWN
   * =======================================================
   */

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [countdown]);

  /*
   * =======================================================
   * FOCUS OTP INPUT
   * =======================================================
   */

  useEffect(() => {
    if (step === "otp") {
      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  /*
   * =======================================================
   * PHONE INPUT
   * =======================================================
   */

  const handlePhoneChange = (
    value: string
  ) => {
    /*
     * Only allow digits.
     */

    const digitsOnly =
      value.replace(/\D/g, "");

    /*
     * Indian mobile number:
     * maximum 10 digits.
     */

    setPhone(
      digitsOnly.slice(0, 10)
    );

    setErrorMessage("");
    setSuccessMessage("");
  };

  /*
   * =======================================================
   * OTP INPUT
   * =======================================================
   */

  const handleOtpChange = (
    value: string
  ) => {
    const digitsOnly =
      value.replace(/\D/g, "");

    setOtp(
      digitsOnly.slice(0, 6)
    );

    setErrorMessage("");
    setSuccessMessage("");
  };

  /*
   * =======================================================
   * VALIDATE PHONE
   * =======================================================
   */

  const validatePhone = () => {
    if (!phone) {
      setErrorMessage(
        "Please enter your mobile number."
      );

      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    return true;
  };

  /*
   * =======================================================
   * SEND OTP
   * =======================================================
   */

  const handleSendOtp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validatePhone()) {
      return;
    }

    try {
      setIsSendingOtp(true);

      /*
       * Backend receives the 10-digit phone number.
       */

      const data =
        await sendOtp(phone);

      /*
       * Move to OTP step.
       */

      setStep("otp");

      /*
       * Reset OTP.
       */

      setOtp("");

      /*
       * Start 60 second resend timer.
       */

      setCountdown(60);

      /*
       * Show backend message if available.
       */

      setSuccessMessage(
        data?.expiresAt
          ? "OTP sent successfully. Please check your mobile."
          : "OTP sent successfully. Please check your mobile."
      );
    } catch (error: any) {
      console.error(
        "Failed to send OTP:",
        error
      );

      const message =
        error?.response?.data?.message;

      setErrorMessage(
        message ||
          "Unable to send OTP right now. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  /*
   * =======================================================
   * VERIFY OTP
   * =======================================================
   */

  const handleVerifyOtp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    /*
     * Validate OTP.
     */

    if (!otp) {
      setErrorMessage(
        "Please enter the OTP."
      );

      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    try {
      setIsVerifyingOtp(true);

      /*
       * Verify OTP with backend.
       */

      const data =
        await verifyOtp(
          phone,
          otp
        );

      /*
       * Store token + authenticated
       * user inside Zustand and localStorage.
       */

      login(
        data.token,
        data.user
      );

      /*
       * Redirect after successful login.
       */

      navigate("/", {
        replace: true,
      });
    } catch (error: any) {
      console.error(
        "Failed to verify OTP:",
        error
      );

      const message =
        error?.response?.data?.message;

      setErrorMessage(
        message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /*
   * =======================================================
   * RESEND OTP
   * =======================================================
   */

  const handleResendOtp = async () => {
    if (
      countdown > 0 ||
      isSendingOtp
    ) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSendingOtp(true);

      await sendOtp(phone);

      setOtp("");

      setCountdown(60);

      setSuccessMessage(
        "A new OTP has been sent to your mobile."
      );

      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } catch (error: any) {
      console.error(
        "Failed to resend OTP:",
        error
      );

      const message =
        error?.response?.data?.message;

      setErrorMessage(
        message ||
          "Unable to resend OTP right now. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  /*
   * =======================================================
   * CHANGE PHONE
   * =======================================================
   */

  const handleChangePhone = () => {
    setStep("phone");

    setOtp("");

    setCountdown(0);

    setErrorMessage("");

    setSuccessMessage("");
  };

  /*
   * =======================================================
   * LOADING / AUTH REDIRECT
   * =======================================================
   */

  if (isAuthenticated) {
    return null;
  }

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

      <div className="mx-auto flex min-h-[calc(100vh-152px)] max-w-md items-center justify-center">

        <section className="w-full">

          {/* =================================================
              BRAND / HEADER
          ================================================= */}

          <div className="text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              GuiltFree Cravings
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {step === "phone"
                ? "Welcome Back"
                : "Verify Your Number"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
              {step === "phone"
                ? "Login securely using your mobile number and OTP."
                : `We've sent a 6-digit OTP to +91 ${phone}.`}
            </p>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

            {/* =================================================
                STEP INDICATOR
            ================================================= */}

            <div className="mb-7 flex items-center justify-center">

              <div className="flex items-center">

                {/* Phone Step */}

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    step === "phone"
                      ? "bg-[#8b542f] text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {step === "otp"
                    ? "✓"
                    : "1"}
                </div>

                <div
                  className={`h-px w-12 sm:w-16 ${
                    step === "otp"
                      ? "bg-[#8b542f]"
                      : "bg-slate-200"
                  }`}
                />

                {/* OTP Step */}

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    step === "otp"
                      ? "bg-[#8b542f] text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  2
                </div>

              </div>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {successMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  ✓
                </div>

                <p className="pt-1 text-xs font-medium leading-5 text-green-700">
                  {successMessage}
                </p>

              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <p className="pt-1 text-xs font-medium leading-5 text-red-700">
                  {errorMessage}
                </p>

              </div>
            )}

            {/* =================================================
                PHONE STEP
            ================================================= */}

            {step === "phone" && (
              <form
                onSubmit={handleSendOtp}
                className="space-y-6"
              >

                <div>

                  <label
                    htmlFor="login-phone"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Mobile Number
                  </label>

                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-[#d9c7b7] bg-white transition focus-within:border-[#8b542f] focus-within:ring-2 focus-within:ring-[#f3e4d3]">

                    <div className="flex items-center border-r border-[#eadfd3] bg-[#fffaf5] px-4 text-sm font-semibold text-slate-600">
                      +91
                    </div>

                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(event) =>
                        handlePhoneChange(
                          event.target.value
                        )
                      }
                      placeholder="Enter 10-digit mobile number"
                      autoComplete="tel"
                      maxLength={10}
                      disabled={isSendingOtp}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    We'll send a one-time password to verify your mobile number.
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={
                    isSendingOtp ||
                    phone.length !== 10
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#754527] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingOtp ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />

                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>

              </form>
            )}

            {/* =================================================
                OTP STEP
            ================================================= */}

            {step === "otp" && (
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >

                <div>

                  <label
                    htmlFor="login-otp"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Enter OTP
                  </label>

                  <input
                    ref={otpInputRef}
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) =>
                      handleOtpChange(
                        event.target.value
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    disabled={isVerifyingOtp}
                    className="mt-2 w-full rounded-2xl border border-[#d9c7b7] bg-white px-4 py-4 text-center text-lg font-bold tracking-[0.45em] text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3] disabled:cursor-not-allowed disabled:bg-slate-50"
                  />

                </div>

                <button
                  type="submit"
                  disabled={
                    isVerifyingOtp ||
                    otp.length !== 6
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#754527] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifyingOtp ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />

                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                {/* =================================================
                    OTP ACTIONS
                ================================================= */}

                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">

                  <button
                    type="button"
                    onClick={
                      handleChangePhone
                    }
                    disabled={
                      isVerifyingOtp
                    }
                    className="text-xs font-semibold text-slate-500 transition hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Change Number
                  </button>

                  {countdown > 0 ? (
                    <p className="text-xs text-slate-400">
                      Resend OTP in{" "}
                      <span className="font-semibold text-slate-600">
                        {countdown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        handleResendOtp
                      }
                      disabled={
                        isSendingOtp ||
                        isVerifyingOtp
                      }
                      className="text-xs font-semibold text-[#8b542f] transition hover:text-[#754527] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSendingOtp
                        ? "Sending..."
                        : "Resend OTP"}
                    </button>
                  )}

                </div>

              </form>
            )}

          </div>

          {/* =================================================
              FOOTER NOTE
          ================================================= */}

          <div className="mt-6 text-center">

            <p className="text-xs leading-5 text-slate-400">
              By continuing, you agree to use your
              mobile number for secure account
              authentication.
            </p>

            <Link
              to="/"
              className="mt-4 inline-block text-sm font-semibold text-[#8b542f] transition hover:text-[#754527]"
            >
              ← Back to Home
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}

export default LoginPage;