import {
  CheckCircle2,
} from "lucide-react";

import {
  ForgotPasswordSteps,
} from "./ForgotPasswordSteps";

import type {
  ForgotPasswordStep,
} from "./types";

interface ForgotPasswordModalProps {
  step: ForgotPasswordStep;

  forgotEmail: string;
  setForgotEmail: (email: string) => void;

  otp: string;
  setOtp: (otp: string) => void;

  resetPassword: string;
  setResetPassword: (password: string) => void;

  confirmResetPassword: string;
  setConfirmResetPassword: (
    password: string
  ) => void;

  showResetPassword: boolean;
  setShowResetPassword: (
    show: boolean
  ) => void;

  showConfirmResetPassword: boolean;
  setShowConfirmResetPassword: (
    show: boolean
  ) => void;

  resetExpiresAt: string | null;

  otpCooldown: number;

  isLoading: boolean;

  error: string;

  onSendOtp: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  onVerifyOtp: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  onResetPassword: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  onResendOtp: () => void;

  onBackToLogin: () => void;

  onStepChange: (
    step: ForgotPasswordStep
  ) => void;

  isPasswordStrong: boolean;
}

export const ForgotPasswordModal = ({
  step,

  forgotEmail,
  setForgotEmail,

  otp,
  setOtp,

  resetPassword,
  setResetPassword,

  confirmResetPassword,
  setConfirmResetPassword,

  showResetPassword,
  setShowResetPassword,

  showConfirmResetPassword,
  setShowConfirmResetPassword,

  resetExpiresAt,

  otpCooldown,

  isLoading,

  error,

  onSendOtp,
  onVerifyOtp,
  onResetPassword,

  onResendOtp,

  onBackToLogin,

  onStepChange,

  isPasswordStrong,
}: ForgotPasswordModalProps) => {
  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  const renderHeader = () => {
    /*
     * SUCCESS HEADER
     */

    if (step === "success") {
      return (
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e4d3]">
            <CheckCircle2
              className="h-7 w-7 text-[#8b542f]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Password Reset Successful
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your admin password has been
            updated successfully.
          </p>
        </div>
      );
    }

    /*
     * NORMAL HEADER
     */

    return (
      <div className="mb-8 text-center">

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {step === "email"
            ? "Forgot Password?"
            : step === "otp"
            ? "Verify OTP"
            : "Create New Password"}
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {step === "email"
            ? "Enter your admin email and we'll send you a secure password reset OTP."
            : step === "otp"
            ? `Enter the 6-digit OTP sent to ${forgotEmail}.`
            : "Create a strong new password for your admin account."}
        </p>
      </div>
    );
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-5 py-10">
      <div className="w-full max-w-md">
        {renderHeader()}

        <section className="rounded-2xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

          {/*
           * IMPORTANT:
           *
           * No global error message here.
           *
           * Error is rendered inside the relevant
           * ForgotPasswordSteps section:
           *
           * Email → email field
           * OTP → OTP field
           * Reset → password fields
           */}

          <ForgotPasswordSteps
            step={step}

            forgotEmail={forgotEmail}
            setForgotEmail={setForgotEmail}

            otp={otp}
            setOtp={setOtp}

            resetPassword={resetPassword}
            setResetPassword={setResetPassword}

            confirmResetPassword={
              confirmResetPassword
            }
            setConfirmResetPassword={
              setConfirmResetPassword
            }

            showResetPassword={
              showResetPassword
            }
            setShowResetPassword={
              setShowResetPassword
            }

            showConfirmResetPassword={
              showConfirmResetPassword
            }
            setShowConfirmResetPassword={
              setShowConfirmResetPassword
            }

            resetExpiresAt={
              resetExpiresAt
            }

            otpCooldown={
              otpCooldown
            }

            isLoading={
              isLoading
            }

            error={error}

            onSendOtp={
              onSendOtp
            }

            onVerifyOtp={
              onVerifyOtp
            }

            onResetPassword={
              onResetPassword
            }

            onResendOtp={
              onResendOtp
            }

            onBackToLogin={
              onBackToLogin
            }

            onStepChange={
              onStepChange
            }

            isPasswordStrong={
              isPasswordStrong
            }
          />

          {/*
           * =====================================================
           * BACK TO LOGIN
           * =====================================================
           *
           * Hide this on success because the success
           * component should provide its own CTA.
           */}

          {step !== "success" && (
            <div className="mt-2 pt-2">
              <button
                type="button"
                onClick={
                  onBackToLogin
                }
                disabled={
                  isLoading
                }
                className="mx-auto flex items-center justify-center text-sm text-slate-500 transition-colors duration-200 hover:text-[#8b542f] hover:underline focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back to Admin Login
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};