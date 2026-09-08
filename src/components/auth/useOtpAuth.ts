import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

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

interface UseOtpAuthProps {
  onSuccess: () => void;
}

export function useOtpAuth({
  onSuccess,
}: UseOtpAuthProps) {
  const login = useAuthStore(
    (state) => state.login
  );

  // ==========================================================
  // AUTH STATE
  // ==========================================================

  const [step, setStep] =
    useState<AuthStep>("phone");

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [resendCountdown, setResendCountdown] =
    useState(0);

  /*
    MSG91 may or may not expose reqId through
    the Web SDK response.

    Therefore reqId is intentionally optional.
  */
  const [msg91ReqId, setMsg91ReqId] =
    useState<string | null>(null);

  const otpInputRef =
    useRef<HTMLInputElement | null>(null);

  // ==========================================================
  // NORMALIZED PHONE
  // ==========================================================

  const normalizedPhone =
    phone.replace(/\D/g, "");

  // ==========================================================
  // INITIALIZE MSG91
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await initializeMsg91Widget();

        if (cancelled) {
          return;
        }
      } catch (initializationError) {
        if (cancelled) {
          return;
        }

        setError(
          getMsg91ErrorMessage(
            initializationError
          )
        );
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // RESEND COUNTDOWN
  // ==========================================================

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setResendCountdown(
          (current) => {
            if (current <= 1) {
              window.clearInterval(
                interval
              );

              return 0;
            }

            return current - 1;
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [resendCountdown]);

  // ==========================================================
  // OTP AUTO FOCUS
  // ==========================================================

  useEffect(() => {
    if (step !== "otp") {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [step]);

  // ==========================================================
  // SEND OTP
  // ==========================================================

  const handleSendOtp = async () => {
    if (loading) {
      return;
    }

    setError("");

    // --------------------------------------------------------
    // PHONE VALIDATION
    // --------------------------------------------------------

    if (
      !/^[6-9]\d{9}$/.test(
        normalizedPhone
      )
    ) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    // --------------------------------------------------------
    // START LOADING
    // --------------------------------------------------------

    setLoading(true);

    setOtp("");

    /*
      Clear old request ID before starting
      a completely new OTP session.
    */
    setMsg91ReqId(null);

    try {
      // ------------------------------------------------------
      // SEND OTP THROUGH MSG91
      // ------------------------------------------------------

      const result =
        await sendMsg91Otp(
          normalizedPhone
        );

      /*
        IMPORTANT:

        MSG91 Web SDK can successfully send
        the OTP without exposing reqId in
        the sendOtp success callback.

        Therefore reqId is NOT required here.

        If MSG91 gives us one, we store it.
        Otherwise we continue normally.
      */

      if (result?.reqId) {
        setMsg91ReqId(result.reqId);
      } else {
        setMsg91ReqId(null);
      }

      // ------------------------------------------------------
      // MOVE TO OTP STEP
      // ------------------------------------------------------

      setStep("otp");

      // ------------------------------------------------------
      // START RESEND COOLDOWN
      // ------------------------------------------------------

      setResendCountdown(
        RESEND_COOLDOWN_SECONDS
      );
    } catch (sendError) {
      setError(
        getMsg91ErrorMessage(sendError)
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  const handleVerifyOtp = async () => {
    if (loading) {
      return;
    }

    setError("");

    // --------------------------------------------------------
    // OTP VALIDATION
    // --------------------------------------------------------

    const otpRegex =
      new RegExp(
        `^\\d{${OTP_LENGTH}}$`
      );

    if (!otpRegex.test(otp)) {
      setError(
        `Please enter the ${OTP_LENGTH}-digit OTP.`
      );

      return;
    }

    /*
      IMPORTANT:

      Do NOT block verification if msg91ReqId
      is missing.

      MSG91 Web SDK can maintain the OTP
      session internally.
    */

    setLoading(true);

    try {
      // ------------------------------------------------------
      // VERIFY OTP WITH MSG91
      // ------------------------------------------------------

      const msg91Result =
        await verifyMsg91Otp(
          otp,
          msg91ReqId
        );

      // ------------------------------------------------------
      // SAFE DEBUG
      // ------------------------------------------------------

      /*
        This intentionally logs only a sanitized
        response shape.

        The actual access token/JWT is never
        printed to the console.
      */

      console.log(
        "MSG91 VERIFY OTP RESPONSE:",
        getSafeMsg91ResponseShape(
          msg91Result
        )
      );

      // ------------------------------------------------------
      // EXTRACT ACCESS TOKEN
      // ------------------------------------------------------

      const accessToken =
        extractMsg91AccessToken(
          msg91Result
        );

      /*
        Safe token information only.
        Never log the actual token.
      */

      console.log(
        "MSG91 ACCESS TOKEN RECEIVED BY BACKEND:",
        {
          exists: Boolean(accessToken),

          length:
            accessToken?.length ?? 0,

          parts: accessToken
            ? accessToken.split(".").length
            : 0,

          looksLikeJwt:
            accessToken
              ? accessToken.split(".")
                  .length === 3
              : false,
        }
      );

      // ------------------------------------------------------
      // TOKEN VALIDATION
      // ------------------------------------------------------

      if (!accessToken) {
        throw new Error(
          "OTP verified, but authentication token was not received. Please try again."
        );
      }

      // ------------------------------------------------------
      // VERIFY TOKEN WITH OUR BACKEND
      // ------------------------------------------------------

      /*
        This is the existing application
        authentication flow.

        We do NOT change it.
      */

      const result =
        await verifyOtp(
          normalizedPhone,
          accessToken
        );

      // ------------------------------------------------------
      // LOGIN INTO ZUSTAND
      // ------------------------------------------------------

      login(
        result.token,
        result.user
      );

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      onSuccess();
    } catch (verifyError) {
      setError(
        getMsg91ErrorMessage(
          verifyError
        )
      );

      /*
        Clear OTP after failed verification
        so user can enter it again.
      */

      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RESEND OTP
  // ==========================================================

  const handleResendOtp = async () => {
    /*
      Prevent duplicate resend requests.
    */

    if (
      loading ||
      resendCountdown > 0
    ) {
      return;
    }

    setError("");

    setLoading(true);

    try {
      // ------------------------------------------------------
      // RETRY OTP
      // ------------------------------------------------------

      /*
        reqId is optional.

        If we have one, it will be passed.
        Otherwise MSG91 SDK can use its own
        current OTP session.
      */

      const result =
        await retryMsg91Otp(
          msg91ReqId
        );

      // ------------------------------------------------------
      // UPDATE REQUEST ID IF AVAILABLE
      // ------------------------------------------------------

      if (result?.reqId) {
        setMsg91ReqId(
          result.reqId
        );
      }

      // ------------------------------------------------------
      // CLEAR OLD OTP
      // ------------------------------------------------------

      setOtp("");

      // ------------------------------------------------------
      // RESTART COUNTDOWN
      // ------------------------------------------------------

      setResendCountdown(
        RESEND_COOLDOWN_SECONDS
      );
    } catch (resendError) {
      setError(
        getMsg91ErrorMessage(
          resendError
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // BACK TO PHONE
  // ==========================================================

  const handleBackToPhone = () => {
    if (loading) {
      return;
    }

    setStep("phone");

    setOtp("");

    setMsg91ReqId(null);

    setError("");

    setResendCountdown(0);
  };

  // ==========================================================
  // PHONE CHANGE
  // ==========================================================

  const handlePhoneChange = (
    value: string
  ) => {
    /*
      Only numbers.
      Maximum 10 digits.
    */

    const sanitizedValue =
      value
        .replace(/\D/g, "")
        .slice(0, 10);

    /*
      If the phone number changes,
      the previous OTP session becomes
      invalid for this UI flow.

      Therefore clear OTP-related state.
    */

    if (
      sanitizedValue !== phone
    ) {
      setMsg91ReqId(null);

      setOtp("");

      setResendCountdown(0);
    }

    setPhone(
      sanitizedValue
    );

    setError("");
  };

  // ==========================================================
  // OTP CHANGE
  // ==========================================================

  const handleOtpChange = (
    value: string
  ) => {
    const sanitizedValue =
      value
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

    setOtp(
      sanitizedValue
    );

    setError("");
  };

  // ==========================================================
  // ENTER KEY
  // ==========================================================

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    /*
      Only handle Enter.
    */

    if (
      event.key !== "Enter" ||
      loading
    ) {
      return;
    }

    // --------------------------------------------------------
    // PHONE STEP
    // --------------------------------------------------------

    if (step === "phone") {
      void handleSendOtp();

      return;
    }

    // --------------------------------------------------------
    // OTP STEP
    // --------------------------------------------------------

    void handleVerifyOtp();
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    step,

    phone,

    otp,

    loading,

    error,

    resendCountdown,

    otpInputRef,

    // --------------------------------------------------------
    // ACTIONS
    // --------------------------------------------------------

    handleSendOtp,

    handleVerifyOtp,

    handleResendOtp,

    handleBackToPhone,

    handlePhoneChange,

    handleOtpChange,

    handleKeyDown,
  };
}