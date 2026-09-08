// src/pages/AdminLoginPage.tsx
import { useEffect, useState, useCallback } from "react";
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

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const login = useAdminAuthStore((state) => state.login);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const forgotPassword = useForgotPassword();

  // Load remembered email
  useEffect(() => {
    try {
      const rememberedEmail = localStorage.getItem(REMEMBER_ADMIN_EMAIL_KEY);
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Unable to load remembered admin email:", error);
    }
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // OTP cooldown timer
  useEffect(() => {
    if (forgotPassword.otpCooldown <= 0) return;

    const timer = window.setInterval(() => {
      forgotPassword.setOtpCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [forgotPassword.otpCooldown]);

  // Check if reset password is strong
  const isResetPasswordStrong = useCallback(() => {
    const requirements = [
      forgotPassword.resetPassword.length >= 8,
      /[A-Z]/.test(forgotPassword.resetPassword),
      /[a-z]/.test(forgotPassword.resetPassword),
      /\d/.test(forgotPassword.resetPassword),
      /[!@#$%^&*(),.?":{}|<>\-+=/\\[\]_]/.test(forgotPassword.resetPassword),
    ];
    return requirements.every((req) => req);
  }, [forgotPassword.resetPassword]);

  // Handle login with improved error handling
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Validation
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!normalizedPassword) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      // Remember email if checked
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ADMIN_EMAIL_KEY, normalizedEmail);
      } else {
        localStorage.removeItem(REMEMBER_ADMIN_EMAIL_KEY);
      }

      // Call login API
      const result = await adminLogin(normalizedEmail, normalizedPassword);
      login(result.token, result.admin);

      // Redirect to dashboard or previous page
      const state = location.state as LocationState | null;
      const redirectPath = state?.from?.pathname || "/admin/dashboard";
      navigate(redirectPath, { replace: true });

    } catch (error: any) {
      console.error("Admin login failed:", error);
      
      // Improved error handling with specific messages
      let errorMessage = "Unable to login. Please try again.";
      
      // Extract error message from different sources
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Check for specific error types
      if (error?.response?.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Admin account not found. Please contact support.";
      } else if (error?.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      // Check for common error messages from backend
      if (errorMessage.toLowerCase().includes("email") || 
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "Admin account not found. Please contact support.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleOpenForgotPassword = () => {
    setError("");
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

  // Handle forgot password form submissions
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await forgotPassword.handleSendResetOtp(forgotPassword.forgotEmail);
    if (success) {
      forgotPassword.setError("");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await forgotPassword.handleVerifyOtp(forgotPassword.otp);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await forgotPassword.handleResetPassword(
      forgotPassword.resetPassword,
      forgotPassword.confirmResetPassword
    );
  };

  const handleBackToLogin = () => {
    forgotPassword.resetForgotPassword();
    forgotPassword.setError("");
  };

  const handleStepChange = (step: typeof forgotPassword.forgotPasswordStep) => {
    forgotPassword.setForgotPasswordStep(step);
    forgotPassword.setError("");
  };

  // If forgot password is open, show the modal
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
        error={forgotPassword.error}
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

  // Main login UI
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-5 py-10">
      <div className="w-full max-w-md">
        {/* Brand / Header */}
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Admin Login
          </h1>
        </div>

        {/* Login Card */}
        <section className="rounded-2xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3" role="alert">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <EmailInput
              id="admin-email"
              label="Email Address"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setError(""); // Clear error on input change
              }}
              placeholder="Enter admin email"
              autoComplete="email"
              disabled={isLoading}
            />

            <PasswordInput
              id="admin-password"
              label="Password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError(""); // Clear error on input change
              }}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              placeholder="Enter admin password"
              autoComplete="current-password"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between gap-4 pt-1">
              <RememberMe
                checked={rememberMe}
                onChange={(checked) => {
                  setRememberMe(checked);
                  setError(""); // Clear error on change
                }}
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={handleOpenForgotPassword}
                disabled={isLoading}
                className="text-sm hover:underline text-[#8b542f] transition-colors duration-200 hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-5 py-3 text-sm text-white transition hover:bg-[#744324] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
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
        </section>
      </div>
    </main>
  );
}

export default AdminLoginPage;