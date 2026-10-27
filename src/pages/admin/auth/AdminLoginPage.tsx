// src/pages/AdminLoginPage.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { useAdminAuthStore } from "../../../store/adminAuthStore";
import { adminLogin } from "../../../api/adminApi";

import { EmailInput } from "../../../components/admin/auth/EmailInput";
import { PasswordInput } from "../../../components/admin/auth/PasswordInput";
import { RememberMe } from "../../../components/admin/auth/RememberMe";
import { ForgotPasswordModal } from "../../../components/admin/auth/ForgotPasswordModal";
import { useForgotPassword } from "../../../components/admin/auth/hooks/useForgotPassword";
import { REMEMBER_ADMIN_EMAIL_KEY } from "../../../components/admin/auth/types";
import type { LocationState } from "../../../components/admin/auth/types";

// ─── Config ───────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_STRENGTH_REGEX = /[!@#$%^&*(),.?":{}|<>\-+=/\\[\]_]/;

// ─── Helpers ──────────────────────────────────────────────
function getLoginErrorMessage(error: any): string {
  // Backend message (priority order)
  let message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to login. Please try again.";

  // Status-specific overrides
  const status = error?.response?.status;
  if (status === 401) message = "Invalid email or password. Please check your credentials.";
  else if (status === 404) message = "Admin account not found. Please contact support.";
  else if (status === 429) message = "Too many login attempts. Please try again later.";
  else if (status === 500) message = "Server error. Please try again later.";
  else if (error?.code === "ERR_NETWORK") {
    message = "Network error. Please check your internet connection.";
  }

  // Common backend message patterns
  const lower = message.toLowerCase();
  if (lower.includes("email") || lower.includes("password") || lower.includes("credentials")) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (lower.includes("not found")) {
    return "Admin account not found. Please contact support.";
  }

  return message;
}

// ─── Component ────────────────────────────────────────────
function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const login = useAdminAuthStore((s) => s.login);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password
  const forgotPassword = useForgotPassword();
  const previousForgotStep = useRef(forgotPassword.forgotPasswordStep);

  // ─── Effects ────────────────────────────────────────────
  // Load remembered email
  useEffect(() => {
    try {
      const rememberedEmail = localStorage.getItem(REMEMBER_ADMIN_EMAIL_KEY);
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    } catch (storageError) {
      console.error("Unable to load remembered admin email:", storageError);
      toast.error("Unable to load saved login details.");
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  // OTP cooldown timer
  useEffect(() => {
    if (forgotPassword.otpCooldown <= 0) return;
    const timer = window.setInterval(() => {
      forgotPassword.setOtpCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [forgotPassword.otpCooldown, forgotPassword]);

  // Forgot password error → toast
  useEffect(() => {
    if (forgotPassword.error) toast.error(forgotPassword.error);
  }, [forgotPassword.error]);

  // Forgot password step change → success toasts
  useEffect(() => {
    const prev = previousForgotStep.current;
    const curr = forgotPassword.forgotPasswordStep;
    if (prev === curr) return;

    if (prev === "email" && curr === "otp") {
      toast.success("OTP sent successfully. Please check your email.");
    }
    if (prev === "otp" && curr === "reset") {
      toast.success("OTP verified successfully.");
    }
    previousForgotStep.current = curr;
  }, [forgotPassword.forgotPasswordStep]);

  // ─── Password strength check ────────────────────────────
  const isResetPasswordStrong = useCallback(() => {
    const pwd = forgotPassword.resetPassword;
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /\d/.test(pwd) &&
      PASSWORD_STRENGTH_REGEX.test(pwd)
    );
  }, [forgotPassword.resetPassword]);

  // ─── Admin login ────────────────────────────────────────
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Validate
    if (!normalizedEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!normalizedPassword) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      // Remember email
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ADMIN_EMAIL_KEY, normalizedEmail);
      } else {
        localStorage.removeItem(REMEMBER_ADMIN_EMAIL_KEY);
      }

      // API call
      const result = await adminLogin(normalizedEmail, normalizedPassword);
      login(result.token, result.admin);
      toast.success("Welcome back! Signing you in...");

      // Redirect
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname || "/admin/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Admin login failed:", error);
      toast.error(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Forgot password handlers ───────────────────────────
  const handleOpenForgotPassword = () => {
    forgotPassword.setForgotEmail(email.trim().toLowerCase());
    forgotPassword.setOtp("");
    forgotPassword.setResetToken("");
    forgotPassword.setResetPassword("");
    forgotPassword.setConfirmResetPassword("");
    forgotPassword.setResetExpiresAt(null);
    forgotPassword.setOtpCooldown(0);
    forgotPassword.setForgotPasswordStep("email");
    forgotPassword.setIsForgotPassword(true);
  };

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await forgotPassword.handleSendResetOtp(forgotPassword.forgotEmail);
    if (success) forgotPassword.setError("");
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await forgotPassword.handleVerifyOtp(forgotPassword.otp);
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await forgotPassword.handleResetPassword(
      forgotPassword.resetPassword,
      forgotPassword.confirmResetPassword
    );
  };

  const handleBackToLogin = () => {
    forgotPassword.resetForgotPassword();
    forgotPassword.setError("");
    toast.success("Back to admin login.");
  };

  const handleStepChange = (step: typeof forgotPassword.forgotPasswordStep) => {
    forgotPassword.setForgotPasswordStep(step);
    forgotPassword.setError("");
  };

  // ─── Forgot password modal ──────────────────────────────
  if (forgotPassword.isForgotPassword) {
    return (
      <ForgotPasswordModal
        step={forgotPassword.forgotPasswordStep}
        forgotEmail={forgotPassword.forgotEmail}
        setForgotEmail={forgotPassword.setForgotEmail}
        otp={forgotPassword.otp}
        setOtp={forgotPassword.setOtp}
        resetPassword={forgotPassword.resetPassword}
        setResetPassword={forgotPassword.setResetPassword}
        confirmResetPassword={forgotPassword.confirmResetPassword}
        setConfirmResetPassword={forgotPassword.setConfirmResetPassword}
        showResetPassword={forgotPassword.showResetPassword}
        setShowResetPassword={forgotPassword.setShowResetPassword}
        showConfirmResetPassword={forgotPassword.showConfirmResetPassword}
        setShowConfirmResetPassword={forgotPassword.setShowConfirmResetPassword}
        resetExpiresAt={forgotPassword.resetExpiresAt}
        otpCooldown={forgotPassword.otpCooldown}
        isLoading={forgotPassword.isLoading}
        error="" // Errors shown via toast instead
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onResetPassword={handleResetPassword}
        onResendOtp={forgotPassword.handleResendOtp}
        onBackToLogin={handleBackToLogin}
        onStepChange={handleStepChange}
        isPasswordStrong={isResetPasswordStrong()}
      />
    );
  }

  // ─── Main login ─────────────────────────────────────────
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-6">
      <div className="relative z-10 w-full max-w-[430px]">
        {/* Brand / header */}
        <div className="mb-7 text-center">
          <h1 className="mt-4 text-[25px] font-semibold tracking-tight text-gray-700 sm:text-[27px]">
            Admin Login
          </h1>
          <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
            Sign in to manage your GuiltFree Cravings store.
          </p>
        </div>

        {/* Login card */}
        <section className="rounded-xl border border-[#F0DDE2] bg-white p-6 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <EmailInput
              id="admin-email"
              label="Email Address"
              value={email}
              onChange={setEmail}
              placeholder="Enter admin email"
              autoComplete="email"
              disabled={isLoading}
            />

            <PasswordInput
              id="admin-password"
              label="Password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              placeholder="Enter admin password"
              autoComplete="current-password"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between gap-4">
              <RememberMe
                checked={rememberMe}
                onChange={setRememberMe}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleOpenForgotPassword}
                disabled={isLoading}
                className="text-[11px] text-[#B5697A] transition-colors duration-200 hover:text-[#A55D6F] hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-[12px]"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-3 text-[12px] text-white transition-all duration-200 hover:bg-[#A55D6F] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B5697A]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-1 text-center">
            <ShieldCheck className="h-3 w-3 text-[#B5697A]" strokeWidth={1.8} />
            <p className="text-[11px] text-slate-500">Secure admin access</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLoginPage;