// src/components/admin/auth/ForgotPasswordSteps.tsx

import { CheckCircle2, ChevronLeft, Mail, RefreshCw, ShieldCheck } from "lucide-react";

import { EmailInput } from "./EmailInput";
import { OtpInput } from "./OtpInput";
import { PasswordInput } from "./PasswordInput";
import { PasswordRequirements } from "./PasswordRequirements";

import type { ForgotPasswordStep } from "./types";

interface ForgotPasswordStepsProps {
  step: ForgotPasswordStep;
  forgotEmail: string;
  setForgotEmail: (email: string) => void;

  otp: string;
  setOtp: (otp: string) => void;

  resetPassword: string;
  setResetPassword: (password: string) => void;

  confirmResetPassword: string;
  setConfirmResetPassword: (password: string) => void;

  showResetPassword: boolean;
  setShowResetPassword: (show: boolean) => void;

  showConfirmResetPassword: boolean;
  setShowConfirmResetPassword: (show: boolean) => void;

  resetExpiresAt: string | null;
  otpCooldown: number;
  isLoading: boolean;
  error: string;

  onSendOtp: (e: React.FormEvent<HTMLFormElement>) => void;
  onVerifyOtp: (e: React.FormEvent<HTMLFormElement>) => void;
  onResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;

  onResendOtp: () => void;
  onBackToLogin: () => void;
  onStepChange: (step: ForgotPasswordStep) => void;

  isPasswordStrong: boolean;
}

export const ForgotPasswordSteps = ({
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
}: ForgotPasswordStepsProps) => {
  // ============================================================
  // STEP 1 — EMAIL
  // ============================================================

  if (step === "email") {
    return (
      <form onSubmit={onSendOtp} className="space-y-5">
        {/* Intro */}
        <div className="flex items-start gap-3 rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] px-4 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBEEF1] text-[#B5697A]">
            <Mail
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-[12px] font-semibold text-gray-600">
              Reset your admin password
            </p>

            <p className="mt-1 text-[10.5px] leading-relaxed text-[#A89486]">
              Enter your admin email to get a verification code.
            </p>
          </div>
        </div>

        <EmailInput
          id="forgot-admin-email"
          label="Admin Email Address"
          value={forgotEmail}
          onChange={setForgotEmail}
          placeholder="Enter admin email"
          autoComplete="email"
          disabled={isLoading}
        />

        {/* Error is intentionally not rendered here.
            AdminLoginPage handles errors through toast. */}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-3.5 text-[13px] text-white shadow-[0_6px_18px_rgba(181,105,122,0.18)] transition-all duration-200 hover:bg-[#A55D6F] hover:shadow-[0_8px_22px_rgba(181,105,122,0.22)] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Sending OTP...
            </>
          ) : (
            "Send Reset OTP"
          )}
        </button>
      </form>
    );
  }

  // ============================================================
  // STEP 2 — OTP
  // ============================================================

  if (step === "otp") {
    return (
      <form onSubmit={onVerifyOtp} className="space-y-5">
        {/* OTP info */}
        <div className="rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-4 w-4 text-[#B5697A]"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <p className="text-[11px] font-medium text-[#6D5844]">
              Verify your email
            </p>
          </div>

          <p className="mt-1 text-[10.5px] leading-5 text-[#A89486]">
            Enter the 6-digit verification code sent to your admin email.
          </p>
        </div>

        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
        />

        {/* Error is intentionally not rendered here.
            AdminLoginPage handles errors through toast. */}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-3.5 text-[13px] text-white shadow-[0_6px_18px_rgba(181,105,122,0.18)] transition-all duration-200 hover:bg-[#A55D6F] hover:shadow-[0_8px_22px_rgba(181,105,122,0.22)] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onStepChange("email")}
            disabled={isLoading}
            className="flex items-center gap-1 text-[11px] hover:underline text-[#A89486] transition hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Change email
          </button>

          <button
            type="button"
            onClick={onResendOtp}
            disabled={isLoading || otpCooldown > 0}
            className="flex items-center gap-1.5 text-[11px] hover:underline text-[#B5697A] transition hover:text-[#A55D6F] disabled:cursor-not-allowed disabled:text-[#B4A49A]"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isLoading ? "animate-spin" : ""
              }`}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {otpCooldown > 0
              ? `Resend in ${otpCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </form>
    );
  }

  // ============================================================
  // STEP 3 — RESET PASSWORD
  // ============================================================

  if (step === "reset") {
    return (
      <form onSubmit={onResetPassword} className="space-y-5">
        {/* Reset info */}
        <div className="flex items-start gap-3 rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] px-4 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBEEF1] text-[#B5697A]">
            <ShieldCheck
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-[11px] font-semibold text-[#2C2C2C]">
              Create a new password
            </p>

            <p className="mt-0 text-[10.5px] leading-5 text-[#A89486]">
              Choose a strong password to keep your admin account secure.
            </p>
          </div>
        </div>

        <PasswordInput
          id="admin-new-password"
          label="New Password"
          value={resetPassword}
          onChange={setResetPassword}
          showPassword={showResetPassword}
          setShowPassword={setShowResetPassword}
          placeholder="Enter new password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <PasswordInput
          id="admin-confirm-password"
          label="Confirm Password"
          value={confirmResetPassword}
          onChange={setConfirmResetPassword}
          showPassword={showConfirmResetPassword}
          setShowPassword={setShowConfirmResetPassword}
          placeholder="Confirm new password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* Error is intentionally not rendered here.
            AdminLoginPage handles errors through toast. */}

        <PasswordRequirements password={resetPassword} />

        <button
          type="submit"
          disabled={
            isLoading ||
            !isPasswordStrong ||
            resetPassword !== confirmResetPassword
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-3.5 text-[13px] text-white shadow-[0_6px_18px_rgba(181,105,122,0.18)] transition-all duration-200 hover:bg-[#A55D6F] hover:shadow-[0_8px_22px_rgba(181,105,122,0.22)] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Updating Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    );
  }

  // ============================================================
  // STEP 4 — SUCCESS
  // ============================================================

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E8C9D0] bg-[#FBEEF1] shadow-[0_8px_24px_rgba(181,105,122,0.10)]">
        <CheckCircle2
          className="h-8 w-8 text-[#B5697A]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-[#2C2C2C]">
        You're All Set
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-[12px] leading-6 text-[#8B7A6C]">
        Your password has been successfully changed. You can now sign in
        using your new password.
      </p>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-3.5 text-[13px] font-medium text-white shadow-[0_6px_18px_rgba(181,105,122,0.18)] transition-all duration-200 hover:bg-[#A55D6F] hover:shadow-[0_8px_22px_rgba(181,105,122,0.22)] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2"
      >
        Back to Admin Login
      </button>
    </div>
  );
};