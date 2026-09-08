// src/components/admin/auth/hooks/useForgotPassword.ts
import { useState } from 'react';
import { forgotAdminPassword, verifyAdminResetOtp, resetAdminPassword } from '../../../../api/adminApi';
import type { ForgotPasswordStep } from '../types';
import { OTP_LENGTH, OTP_RESEND_COOLDOWN } from '../types';

export const useForgotPassword = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);
  const [resetExpiresAt, setResetExpiresAt] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetOtp = async (email: string) => {
    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your admin email address.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return false;
    }

    try {
      setIsLoading(true);
      await forgotAdminPassword(normalizedEmail);
      setForgotEmail(normalizedEmail);
      setOtp("");
      setResetToken("");
      setForgotPasswordStep("otp");
      setOtpCooldown(OTP_RESEND_COOLDOWN);
      return true;
    } catch (error: any) {
      console.error("Forgot admin password failed:", error);
      
      let errorMessage = "Unable to send the reset OTP. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 404) {
        errorMessage = "No admin account found with this email address.";
      } else if (error.message?.toLowerCase().includes("not found")) {
        errorMessage = "No admin account found with this email address.";
      } else if (error.message?.toLowerCase().includes("invalid")) {
        errorMessage = "Invalid email address. Please try again.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    setError("");
    const normalizedOtp = otpValue.replace(/\D/g, "");

    if (normalizedOtp.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return false;
    }

    try {
      setIsLoading(true);
      const result = await verifyAdminResetOtp(forgotEmail, normalizedOtp);
      setResetToken(result.resetToken);
      setResetExpiresAt(result.expiresAt);
      setForgotPasswordStep("reset");
      return true;
    } catch (error: any) {
      console.error("Admin reset OTP verification failed:", error);
      
      let errorMessage = "Invalid or expired OTP. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        errorMessage = "Invalid OTP. Please check and try again.";
      } else if (error.message?.toLowerCase().includes("expired")) {
        errorMessage = "OTP has expired. Please request a new one.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCooldown > 0 || isLoading) return;

    setError("");
    try {
      setIsLoading(true);
      await forgotAdminPassword(forgotEmail);
      setOtp("");
      setOtpCooldown(OTP_RESEND_COOLDOWN);
    } catch (error: any) {
      console.error("Admin reset OTP resend failed:", error);
      
      let errorMessage = "Unable to resend OTP. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 404) {
        errorMessage = "No admin account found with this email address.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!resetToken) {
      setError("Your password reset session has expired. Please request a new OTP.");
      return false;
    }

    try {
      setIsLoading(true);
      await resetAdminPassword(forgotEmail, resetToken, newPassword);
      setForgotPasswordStep("success");
      setResetPassword("");
      setConfirmResetPassword("");
      return true;
    } catch (error: any) {
      console.error("Admin password reset failed:", error);
      
      let errorMessage = "Unable to reset password. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        errorMessage = "Invalid reset token. Please request a new OTP.";
      } else if (error.message?.toLowerCase().includes("expired")) {
        errorMessage = "Reset session has expired. Please request a new OTP.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setIsForgotPassword(false);
    setForgotPasswordStep("email");
    setForgotEmail("");
    setOtp("");
    setResetToken("");
    setResetPassword("");
    setConfirmResetPassword("");
    setResetExpiresAt(null);
    setOtpCooldown(0);
    setError("");
  };

  return {
    isForgotPassword,
    setIsForgotPassword,
    forgotPasswordStep,
    setForgotPasswordStep,
    forgotEmail,
    setForgotEmail,
    otp,
    setOtp,
    resetToken,
    setResetToken,
    resetPassword,
    setResetPassword,
    confirmResetPassword,
    setConfirmResetPassword,
    showResetPassword,
    setShowResetPassword,
    showConfirmResetPassword,
    setShowConfirmResetPassword,
    resetExpiresAt,
    setResetExpiresAt,
    otpCooldown,
    setOtpCooldown,
    error,
    setError,
    isLoading,
    handleSendResetOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
    resetForgotPassword
  };
};

// Default export bhi add karo agar koi default import kar raha hai
export default useForgotPassword;