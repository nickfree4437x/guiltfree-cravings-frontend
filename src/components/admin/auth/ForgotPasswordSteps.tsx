// src/components/admin/auth/ForgotPasswordSteps.tsx
import { CheckCircle2 } from 'lucide-react';
import { EmailInput } from './EmailInput';
import { OtpInput } from './OtpInput';
import { PasswordInput } from './PasswordInput';
import { PasswordRequirements } from './PasswordRequirements';
import type { ForgotPasswordStep } from './types';

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
  // Step 1 - Email
  if (step === "email") {
    return (
      <form onSubmit={onSendOtp} className="space-y-5">
        <EmailInput
          id="forgot-admin-email"
          label="Admin Email Address"
          value={forgotEmail}
          onChange={setForgotEmail}
          placeholder="Enter admin email"
          autoComplete="email"
          disabled={isLoading}
        />

        {error && (
          <p
            className="mt-[-0.75rem] text-sm leading-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8b542f] px-5 py-3.5 text-sm text-white transition hover:bg-[#744324] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
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

  // Step 2 - OTP
  if (step === "otp") {
    return (
      <form onSubmit={onVerifyOtp} className="space-y-5">
        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
        />

        {error && (
          <p
            className="mt-[-0.75rem] text-sm leading-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8b542f] px-5 py-3 text-sm text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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

        <div className="flex items-center justify-between gap-4 pt-1">
          <button
            type="button"
            onClick={() => onStepChange("email")}
            disabled={isLoading}
            className="text-sm hover:underline text-slate-500 transition hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Change email
          </button>

          <button
            type="button"
            onClick={onResendOtp}
            disabled={isLoading || otpCooldown > 0}
            className="text-sm hover:underline text-[#8b542f] transition hover:text-[#744324] disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {otpCooldown > 0
              ? `Resend in ${otpCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </form>
    );
  }

  // Step 3 - Reset Password
  if (step === "reset") {
    return (
      <form onSubmit={onResetPassword} className="space-y-5">
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

        {error && (
          <p
            className="text-sm leading-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <PasswordRequirements password={resetPassword} />

        {resetExpiresAt && (
          <p className="text-center text-xs text-slate-400">
            Your reset session is valid for a limited time. Please complete
            the password reset without leaving this page.
          </p>
        )}

        <button
          type="submit"
          disabled={
            isLoading ||
            !isPasswordStrong ||
            resetPassword !== confirmResetPassword
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-5 py-3 text-sm hoer:underline text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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

  // Step 4 - Success
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
        <CheckCircle2
          className="h-8 w-8 text-[#8b542f]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">
        You're All Set
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        Your password has been successfully changed. You can now sign in
        using your new password.
      </p>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-5 py-3 text-sm text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
      >
        Back to Admin Login
      </button>
    </div>
  );
};