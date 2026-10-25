import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { verifyOtp } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import {
  initializeMsg91Widget,
  retryMsg91Otp,
  sendMsg91Otp,
  verifyMsg91Otp,
} from "../../api/msg91Api";

import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  extractMsg91AccessToken,
  getMsg91ErrorMessage,
  getSafeMsg91ResponseShape,
  type AuthStep,
} from "./otpAuthUtils";

// ─── Types ────────────────────────────────────────────────
interface UseOtpAuthProps {
  onSuccess: () => void;
}

// ─── Hook ─────────────────────────────────────────────────
export function useOtpAuth({ onSuccess }: UseOtpAuthProps) {
  const login = useAuthStore((s) => s.login);

  // State
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // MSG91 may or may not expose reqId — kept optional
  const [msg91ReqId, setMsg91ReqId] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedPhone = phone.replace(/\D/g, "");

  // Initialize MSG91 widget on mount
  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      try {
        await initializeMsg91Widget();
        if (cancelled) return;
      } catch (initError) {
        if (cancelled) return;
        setError(getMsg91ErrorMessage(initError));
      }
    };
    void initialize();
    return () => { cancelled = true; };
  }, []);

  // Resend countdown ticker
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resendCountdown]);

  // Auto-focus OTP input when step becomes "otp"
  useEffect(() => {
    if (step !== "otp") return;
    const timeout = window.setTimeout(() => otpInputRef.current?.focus(), 100);
    return () => window.clearTimeout(timeout);
  }, [step]);

  // ─── Send OTP ───────────────────────────────────────────
  const handleSendOtp = async () => {
    if (loading) return;
    setError("");

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    setOtp("");
    setMsg91ReqId(null); // clear old request ID

    try {
      const result = await sendMsg91Otp(normalizedPhone);
      // reqId optional — store if provided
      setMsg91ReqId(result?.reqId ?? null);
      setStep("otp");
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (sendError) {
      setError(getMsg91ErrorMessage(sendError));
    } finally {
      setLoading(false);
    }
  };

  // ─── Verify OTP ─────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (loading) return;
    setError("");

    const otpRegex = new RegExp(`^\\d{${OTP_LENGTH}}$`);
    if (!otpRegex.test(otp)) {
      setError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }

    setLoading(true);

    try {
      const msg91Result = await verifyMsg91Otp(otp, msg91ReqId);

      // Safe debug (no tokens logged)
      console.log("MSG91 VERIFY OTP RESPONSE:", getSafeMsg91ResponseShape(msg91Result));

      const accessToken = extractMsg91AccessToken(msg91Result);

      // Safe token info (never log actual token)
      console.log("MSG91 ACCESS TOKEN RECEIVED BY BACKEND:", {
        exists: Boolean(accessToken),
        length: accessToken?.length ?? 0,
        parts: accessToken ? accessToken.split(".").length : 0,
        looksLikeJwt: accessToken ? accessToken.split(".").length === 3 : false,
      });

      if (!accessToken) {
        throw new Error(
          "OTP verified, but authentication token was not received. Please try again."
        );
      }

      // Existing backend flow — unchanged
      const result = await verifyOtp(normalizedPhone, accessToken);

      login(result.token, result.user);
      onSuccess();
    } catch (verifyError) {
      setError(getMsg91ErrorMessage(verifyError));
      setOtp(""); // clear on failure
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ─────────────────────────────────────────
  const handleResendOtp = async () => {
    if (loading || resendCountdown > 0) return;
    setError("");
    setLoading(true);

    try {
      const result = await retryMsg91Otp(msg91ReqId);
      if (result?.reqId) setMsg91ReqId(result.reqId);
      setOtp("");
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (resendError) {
      setError(getMsg91ErrorMessage(resendError));
    } finally {
      setLoading(false);
    }
  };

  // ─── Back to Phone ──────────────────────────────────────
  const handleBackToPhone = () => {
    if (loading) return;
    setStep("phone");
    setOtp("");
    setMsg91ReqId(null);
    setError("");
    setResendCountdown(0);
  };

  // ─── Phone Change ───────────────────────────────────────
  const handlePhoneChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 10);

    // Phone changed → old OTP session becomes invalid
    if (sanitized !== phone) {
      setMsg91ReqId(null);
      setOtp("");
      setResendCountdown(0);
    }

    setPhone(sanitized);
    setError("");
  };

  // ─── OTP Change ─────────────────────────────────────────
  const handleOtpChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(sanitized);
    setError("");
  };

  // ─── Enter key ──────────────────────────────────────────
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || loading) return;
    if (step === "phone") {
      void handleSendOtp();
      return;
    }
    void handleVerifyOtp();
  };

  // ─── Return ─────────────────────────────────────────────
  return {
    // State
    step,
    phone,
    otp,
    loading,
    error,
    resendCountdown,
    otpInputRef,

    // Actions
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToPhone,
    handlePhoneChange,
    handleOtpChange,
    handleKeyDown,
  };
}