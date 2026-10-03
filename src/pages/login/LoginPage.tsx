import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { verifyOtp } from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";

import {
  initializeMsg91Widget,
  sendMsg91Otp,
  verifyMsg91Otp,
  retryMsg91Otp,
} from "../../utils/msg91Otp";

/*
 * =========================================================
 * LOGIN CONFIGURATION
 * =========================================================
 */

const OTP_LENGTH = 4;

const OTP_RESEND_COUNTDOWN = 60;

/*
 * =========================================================
 * LOGIN STEP
 * =========================================================
 */

type LoginStep =
  | "phone"
  | "otp";

/*
 * =========================================================
 * MSG91 ACCESS TOKEN EXTRACTION
 * =========================================================
 */

const extractMsg91AccessToken = (
  response: unknown
): string => {
  /*
   * -------------------------------------------------------
   * Response itself is a string
   * -------------------------------------------------------
   */

  if (typeof response === "string") {
    return response.trim();
  }

  /*
   * -------------------------------------------------------
   * Invalid response
   * -------------------------------------------------------
   */

  if (
    !response ||
    typeof response !== "object"
  ) {
    return "";
  }

  const data =
    response as Record<
      string,
      unknown
    >;

  /*
   * -------------------------------------------------------
   * Direct access-token fields
   * -------------------------------------------------------
   */

  const directToken =
    data.accessToken ??
    data["access-token"] ??
    data.access_token ??
    data.token;

  if (
    typeof directToken === "string" &&
    directToken.trim()
  ) {
    return directToken.trim();
  }

  /*
   * -------------------------------------------------------
   * MSG91 Web SDK success response
   * -------------------------------------------------------
   */

  if (
    typeof data.message === "string" &&
    data.message.trim()
  ) {
    return data.message.trim();
  }

  /*
   * -------------------------------------------------------
   * Nested data response
   * -------------------------------------------------------
   */

  if (
    data.data &&
    typeof data.data === "object"
  ) {
    const nestedData =
      data.data as Record<
        string,
        unknown
      >;

    const nestedToken =
      nestedData.accessToken ??
      nestedData["access-token"] ??
      nestedData.access_token ??
      nestedData.token;

    if (
      typeof nestedToken === "string" &&
      nestedToken.trim()
    ) {
      return nestedToken.trim();
    }

    if (
      typeof nestedData.message ===
        "string" &&
      nestedData.message.trim()
    ) {
      return nestedData.message.trim();
    }
  }

  /*
   * -------------------------------------------------------
   * Nested response object
   * -------------------------------------------------------
   */

  if (
    data.response &&
    typeof data.response === "object"
  ) {
    const nestedResponse =
      data.response as Record<
        string,
        unknown
      >;

    const nestedToken =
      nestedResponse.accessToken ??
      nestedResponse["access-token"] ??
      nestedResponse.access_token ??
      nestedResponse.token;

    if (
      typeof nestedToken === "string" &&
      nestedToken.trim()
    ) {
      return nestedToken.trim();
    }

    if (
      typeof nestedResponse.message ===
        "string" &&
      nestedResponse.message.trim()
    ) {
      return nestedResponse.message.trim();
    }
  }

  return "";
};

/*
 * =========================================================
 * MSG91 ERROR MESSAGE
 * =========================================================
 */

const getMsg91ErrorMessage = (
  error: unknown
): string => {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object"
  ) {
    const errorData =
      error as Record<
        string,
        unknown
      >;

    if (
      typeof errorData.message ===
        "string" &&
      errorData.message.trim()
    ) {
      return errorData.message;
    }

    if (
      typeof errorData.error ===
        "string" &&
      errorData.error.trim()
    ) {
      return errorData.error;
    }

    if (
      typeof errorData.msg ===
        "string" &&
      errorData.msg.trim()
    ) {
      return errorData.msg;
    }

    /*
     * Axios-style response error.
     */

    const response =
      errorData.response;

    if (
      response &&
      typeof response === "object"
    ) {
      const responseData =
        response as Record<
          string,
          unknown
        >;

      const data =
        responseData.data;

      if (
        data &&
        typeof data === "object"
      ) {
        const nestedData =
          data as Record<
            string,
            unknown
          >;

        if (
          typeof nestedData.message ===
            "string" &&
          nestedData.message.trim()
        ) {
          return nestedData.message;
        }

        if (
          typeof nestedData.error ===
            "string" &&
          nestedData.error.trim()
        ) {
          return nestedData.error;
        }

        if (
          typeof nestedData.msg ===
            "string" &&
          nestedData.msg.trim()
        ) {
          return nestedData.msg;
        }
      }
    }
  }

  return "Unable to process OTP. Please try again.";
};

/*
 * =========================================================
 * LOGIN PAGE
 * =========================================================
 */

function LoginPage() {
  const navigate =
    useNavigate();

  /*
   * =======================================================
   * AUTH STORE
   * =======================================================
   */

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const login =
    useAuthStore(
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
   * MSG91 REQUEST ID
   * =======================================================
   */

  const [msg91ReqId, setMsg91ReqId] =
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
   * OTP INPUT REF
   * =======================================================
   */

  const otpInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /*
   * =======================================================
   * INITIALIZE MSG91 WIDGET
   * =======================================================
   */

  useEffect(() => {
    initializeMsg91Widget().catch(
      (error) => {
        console.error(
          "Failed to initialize MSG91 widget:",
          error
        );
      }
    );
  }, []);

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

    const timer =
      window.setInterval(() => {
        setCountdown(
          (current) => {
            if (current <= 1) {
              window.clearInterval(
                timer
              );

              return 0;
            }

            return current - 1;
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [countdown]);

  /*
   * =======================================================
   * FOCUS OTP INPUT
   * =======================================================
   */

  useEffect(() => {
    if (step === "otp") {
      const timer =
        window.setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);

      return () => {
        window.clearTimeout(
          timer
        );
      };
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
    const digitsOnly =
      value.replace(/\D/g, "");

    const nextPhone =
      digitsOnly.slice(0, 10);

    setPhone(nextPhone);

    setMsg91ReqId("");

    setOtp("");

    setCountdown(0);
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
      digitsOnly.slice(
        0,
        OTP_LENGTH
      )
    );
  };

  /*
   * =======================================================
   * VALIDATE PHONE
   * =======================================================
   */

  const validatePhone = () => {
    if (!phone) {
      toast.error(
        "Please enter your mobile number."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(phone)
    ) {
      toast.error(
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

    if (isSendingOtp) {
      return;
    }

    if (!validatePhone()) {
      return;
    }

    try {
      setIsSendingOtp(true);

      setOtp("");

      setMsg91ReqId("");

      const result =
        await sendMsg91Otp(
          phone
        );

      if (!result.reqId) {
        throw new Error(
          "MSG91 did not return a request ID. Please try again."
        );
      }

      setMsg91ReqId(
        result.reqId
      );

      setStep("otp");

      setCountdown(
        OTP_RESEND_COUNTDOWN
      );

      toast.success(
        "OTP sent successfully. Please check your mobile."
      );
    } catch (error: unknown) {
      console.error(
        "Failed to send OTP:",
        error
      );

      toast.error(
        getMsg91ErrorMessage(
          error
        )
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

    if (isVerifyingOtp) {
      return;
    }

    if (!otp) {
      toast.error(
        "Please enter the OTP."
      );

      return;
    }

    if (
      !new RegExp(
        `^\\d{${OTP_LENGTH}}$`
      ).test(otp)
    ) {
      toast.error(
        `Please enter the ${OTP_LENGTH}-digit OTP.`
      );

      return;
    }

    if (!msg91ReqId) {
      toast.error(
        "Your OTP session has expired. Please request a new OTP."
      );

      return;
    }

    try {
      setIsVerifyingOtp(true);

      /*
       * Verify OTP with MSG91.
       */

      const msg91Result =
        await verifyMsg91Otp(
          otp,
          msg91ReqId
        );

      /*
       * Extract MSG91 access token.
       */

      const accessToken =
        extractMsg91AccessToken(
          msg91Result
        );

      if (!accessToken) {
        console.error(
          "MSG91 verification response did not contain an access token:",
          msg91Result
        );

        throw new Error(
          "MSG91 verification succeeded, but no access token was returned."
        );
      }

      /*
       * Verify with our backend.
       */

      const data =
        await verifyOtp(
          phone,
          accessToken
        );

      /*
       * Store auth state.
       */

      login(
        data.token,
        data.user
      );

      /*
       * Show success message.
       */

      toast.success(
        "Login successful!"
      );

      /*
       * Redirect.
       */

      navigate("/", {
        replace: true,
      });
    } catch (error: unknown) {
      console.error(
        "Failed to verify OTP:",
        error
      );

      toast.error(
        getMsg91ErrorMessage(
          error
        )
      );

      setOtp("");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /*
   * =======================================================
   * RESEND OTP
   * =======================================================
   */

  const handleResendOtp =
    async () => {
      if (
        countdown > 0 ||
        isSendingOtp ||
        isVerifyingOtp
      ) {
        return;
      }

      if (!msg91ReqId) {
        toast.error(
          "Your OTP session has expired. Please change your number and try again."
        );

        return;
      }

      try {
        setIsSendingOtp(true);

        const result =
          await retryMsg91Otp(
            msg91ReqId
          );

        if (result.reqId) {
          setMsg91ReqId(
            result.reqId
          );
        }

        setOtp("");

        setCountdown(
          OTP_RESEND_COUNTDOWN
        );

        toast.success(
          "A new OTP has been sent to your mobile."
        );

        window.setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      } catch (error: unknown) {
        console.error(
          "Failed to resend OTP:",
          error
        );

        toast.error(
          getMsg91ErrorMessage(
            error
          )
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

  const handleChangePhone =
    () => {
      if (
        isSendingOtp ||
        isVerifyingOtp
      ) {
        return;
      }

      setStep("phone");

      setOtp("");

      setMsg91ReqId("");

      setCountdown(0);
    };

  /*
   * =======================================================
   * AUTH REDIRECT
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
    <main
      className="
        min-h-screen
        bg-white
        px-4
        py-8
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-64px)]
          max-w-[460px]
          items-center
          justify-center
        "
      >
        <section className="w-full">
          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#F0E3E6]
              bg-white
              shadow-sm
            "
          >

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <div
              className="
                mx-auto
                w-full
                max-w-[420px]
                px-6
                py-7
                sm:px-8
                sm:py-8
              "
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="pr-2">

                <h1
                  className="
                    mt-1
                    text-[20px]
                    font-semibold
                    leading-relaxed
                    text-center
                    tracking-[-0.025em]
                    text-[#2C2C2C]
                    sm:text-[22px]
                  "
                >
                  {step === "phone"
                    ? "Welcome Back!"
                    : "Verify Your Number"}
                </h1>

                <p
                  className="
                    mt-0
                    max-w-[390px]
                    text-[12px]
                    text-center
                    leading-relaxed
                    text-gray-600
                    sm:text-[13px]
                  "
                >
                  {step === "phone"
                    ? "Enter your mobile number."
                    : "Enter the 4-digit code."}
                </p>
              </div>

              {/* =================================================
                  STEP INDICATOR
              ================================================= */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                "
              >
                <div className="flex items-center">
                  {/* =============================================
                      STEP 1
                  ============================================== */}

                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[10px]
                        transition-all
                        duration-200

                        ${
                          step === "phone"
                            ? "bg-[#B5697A] text-white"
                            : "bg-[#F8EDEF] text-[#B5697A]"
                        }
                      `}
                    >
                      {step === "otp"
                        ? "✓"
                        : "1"}
                    </span>

                    <span
                      className={`
                        text-[11px]
                        sm:text-[12px]

                        ${
                          step === "phone"
                            ? "text-[#3A3335]"
                            : "text-[#A69B9E]"
                        }
                      `}
                    >
                      Mobile
                    </span>
                  </div>

                  {/* =============================================
                      CONNECTOR
                  ============================================== */}

                  <div
                    className={`
                      mx-3
                      h-px
                      w-9
                      sm:w-11

                      ${
                        step === "otp"
                          ? "bg-[#D7AAB5]"
                          : "bg-[#E9DDE0]"
                      }
                    `}
                  />

                  {/* =============================================
                      STEP 2
                  ============================================== */}

                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[10px]
                        transition-all
                        duration-200

                        ${
                          step === "otp"
                            ? "bg-[#B5697A] text-white shadow-[0_3px_10px_rgba(181,105,122,0.18)]"
                            : "bg-[#F8EDEF] text-[#B5697A]"
                        }
                      `}
                    >
                      2
                    </span>

                    <span
                      className={`
                        text-[11px]
                        sm:text-[12px]

                        ${
                          step === "otp"
                            ? "text-[#3A3335]"
                            : "text-[#A69B9E]"
                        }
                      `}
                    >
                      Verification
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  PHONE FORM
              ================================================= */}

              {step === "phone" && (
                <form
                  onSubmit={handleSendOtp}
                  className="mt-7"
                >
                  {/* =============================================
                      PHONE FIELD
                  ============================================== */}

                  <div>

                    <div
                      className="
                        mt-2
                        flex
                        h-[45px]
                        w-full
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#E8DCDF]
                        bg-white
                        transition-all
                        duration-200
                        focus-within:border-[#B5697A]
                      "
                    >
                      {/* Country code */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          border-r
                          border-[#EDE1E4]
                          bg-[#FFFBFC]
                          px-3.5
                          sm:px-4
                        "
                      >
                        <span
                          className="
                            text-[12px]
                            font-semibold
                            text-[#3A3335]
                            sm:text-[13px]
                          "
                        >
                          +91
                        </span>
                      </div>

                      {/* Input */}

                      <input
                        id="login-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) =>
                          handlePhoneChange(
                            event.target.value
                          )
                        }
                        placeholder="Enter mobile number"
                        maxLength={10}
                        disabled={
                          isSendingOtp
                        }
                        className="
                          min-w-0
                          flex-1
                          bg-transparent
                          px-3.5
                          text-[13px]
                          text-[#2C2C2C]
                          outline-none
                          placeholder:font-normal
                          placeholder:text-[#A69B9E]
                          disabled:cursor-not-allowed
                          sm:px-4
                          sm:text-[14px]
                        "
                        aria-label="Phone Number"
                      />
                    </div>

                  </div>

                  {/* =============================================
                      SEND OTP
                  ============================================== */}

                  <button
                    type="submit"
                    disabled={
                      isSendingOtp
                    }
                    className="
                      mt-6
                      flex
                      h-[46px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[12px]
                      bg-[#B5697A]
                      px-5
                      text-[13px]
                      text-white
                      transition-all
                      duration-200
                      hover:bg-[#A85D6F]
                      hover:shadow-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#B5697A]/25
                      focus:ring-offset-2
                      disabled:cursor-not-allowed
                      disabled:bg-[#D7AEB8]
                      disabled:shadow-none
                    "
                  >
                    {isSendingOtp ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/35
                            border-t-white
                          "
                        />

                        <span>
                          Sending OTP...
                        </span>
                      </>
                    ) : (
                      <span>
                        Continue
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* =================================================
                  OTP FORM
              ================================================= */}

              {step === "otp" && (
                <form
                  onSubmit={
                    handleVerifyOtp
                  }
                  className="mt-7"
                >
                  {/* =============================================
                      CHANGE NUMBER
                  ============================================== */}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={
                        handleChangePhone
                      }
                      disabled={
                        isSendingOtp ||
                        isVerifyingOtp
                      }
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        text-[11px]
                        text-[#8F8588]
                        transition-colors
                        duration-200
                        hover:text-[#B5697A]
                        hover:underline
                        focus:outline-none
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      <span>
                        Change mobile number
                      </span>
                    </button>
                  </div>

                  {/* =============================================
                      OTP INPUT
                  ============================================== */}

                  <div className="relative mt-6">
                    <input
                      ref={
                        otpInputRef
                      }
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(
                        event
                      ) =>
                        handleOtpChange(
                          event.target
                            .value
                        )
                      }
                      maxLength={
                        OTP_LENGTH
                      }
                      disabled={
                        isVerifyingOtp
                      }
                      aria-label="One-time password"
                      className="
                        absolute
                        inset-0
                        z-10
                        h-full
                        w-full
                        cursor-text
                        opacity-0
                        disabled:cursor-not-allowed
                      "
                    />

                    {/* OTP BOXES */}

                    <div
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        sm:gap-2.5
                      "
                      aria-hidden="true"
                    >
                      {Array.from({
                        length:
                          OTP_LENGTH,
                      }).map(
                        (_, index) => {
                          const digit =
                            otp[
                              index
                            ] ?? "";

                          const isActive =
                            index ===
                            otp.length;

                          return (
                            <div
                              key={
                                index
                              }
                              className={`
                                flex
                                h-[50px]
                                w-[50px]
                                items-center
                                justify-center
                                rounded-[12px]
                                border
                                bg-white
                                text-[18px]
                                font-semibold
                                tracking-wide
                                text-[#2C2C2C]
                                transition-all
                                duration-200
                                sm:h-[52px]
                                sm:w-[52px]
                                sm:text-[19px]

                                ${
                                  isActive
                                    ? "border-[#B5697A] bg-[#FFFBFC]"
                                    : digit
                                      ? "border-[#D9B4BD] bg-[#FFFBFC]"
                                      : "border-[#E8DCDF]"
                                }
                              `}
                            >
                              {
                                digit
                              }
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* =============================================
                      VERIFY
                  ============================================== */}

                  <button
                    type="submit"
                    disabled={
                      isVerifyingOtp
                    }
                    className="
                      mt-5
                      flex
                      h-[46px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[12px]
                      bg-[#B5697A]
                      px-5
                      text-[13px]
                      text-white
                      transition-all
                      duration-200
                      hover:bg-[#A85D6F]
                      hover:shadow-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#B5697A]/25
                      focus:ring-offset-2
                      disabled:cursor-not-allowed
                      disabled:bg-[#D7AEB8]
                      disabled:shadow-none
                    "
                  >
                    {isVerifyingOtp ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/35
                            border-t-white
                          "
                        />

                        <span>
                          Verifying...
                        </span>
                      </>
                    ) : (
                      <span>
                        Verify & Continue
                      </span>
                    )}
                  </button>

                  {/* =============================================
                      RESEND
                  ============================================== */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      text-[11px]
                    "
                  >
                    <span className="text-[#A49A9C]">
                      Didn't receive the code?
                    </span>

                    {countdown >
                    0 ? (
                      <span className="text-[#8F8588]">
                        Resend in{" "}
                        {
                          countdown
                        }
                        s
                      </span>
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
                        className="
                          text-[#B5697A]
                          transition-colors
                          duration-200
                          hover:text-[#A85D6F]
                          hover:underline
                          focus:outline-none
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isSendingOtp
                          ? "Sending..."
                          : "Resend OTP"}
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div
                className="
                  mt-8
                  border-t
                  border-[#F1E5E8]
                  pt-5
                "
              >
                <p
                  className="
                    text-center
                    text-[9px]
                    leading-5
                    text-[#A49A9C]
                    sm:text-[11px]
                  "
                >
                  By continuing, you agree to our{" "}
                  <span className="text-[#B5697A]">
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span className=" text-[#B5697A]">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;