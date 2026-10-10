// src/pages/AdminLoginPage.tsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAdminAuthStore,
} from "../../../store/adminAuthStore";

import {
  adminLogin,
} from "../../../api/adminApi";

import {
  EmailInput,
} from "../../../components/admin/auth/EmailInput";

import {
  PasswordInput,
} from "../../../components/admin/auth/PasswordInput";

import {
  RememberMe,
} from "../../../components/admin/auth/RememberMe";

import {
  ForgotPasswordModal,
} from "../../../components/admin/auth/ForgotPasswordModal";

import {
  useForgotPassword,
} from "../../../components/admin/auth/hooks/useForgotPassword";

import {
  REMEMBER_ADMIN_EMAIL_KEY,
} from "../../../components/admin/auth/types";

import type {
  LocationState,
} from "../../../components/admin/auth/types";


function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated =
    useAdminAuthStore(
      (state) => state.isAuthenticated
    );

  const login =
    useAdminAuthStore(
      (state) => state.login
    );

  /*
   * ============================================================
   * LOGIN STATE
   * ============================================================
   */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);


  /*
   * ============================================================
   * FORGOT PASSWORD
   * ============================================================
   */

  const forgotPassword =
    useForgotPassword();

  const previousForgotStep =
    useRef(
      forgotPassword.forgotPasswordStep
    );


  /*
   * ============================================================
   * LOAD REMEMBERED EMAIL
   * ============================================================
   */

  useEffect(() => {
    try {
      const rememberedEmail =
        localStorage.getItem(
          REMEMBER_ADMIN_EMAIL_KEY
        );

      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    } catch (storageError) {
      console.error(
        "Unable to load remembered admin email:",
        storageError
      );

      toast.error(
        "Unable to load saved login details."
      );
    }
  }, []);


  /*
   * ============================================================
   * REDIRECT IF ALREADY AUTHENTICATED
   * ============================================================
   */

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);


  /*
   * ============================================================
   * OTP COOLDOWN TIMER
   * ============================================================
   */

  useEffect(() => {
    if (
      forgotPassword.otpCooldown <= 0
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        forgotPassword.setOtpCooldown(
          (current) =>
            current > 0
              ? current - 1
              : 0
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    forgotPassword.otpCooldown,
    forgotPassword,
  ]);


  /*
   * ============================================================
   * FORGOT PASSWORD ERROR -> TOAST
   * ============================================================
   */

  useEffect(() => {
    if (!forgotPassword.error) {
      return;
    }

    toast.error(
      forgotPassword.error
    );
  }, [
    forgotPassword.error,
  ]);


  /*
   * ============================================================
   * FORGOT PASSWORD STEP SUCCESS TOASTS
   * ============================================================
   */

  useEffect(() => {
    const previousStep =
      previousForgotStep.current;

    const currentStep =
      forgotPassword.forgotPasswordStep;

    if (
      previousStep !== currentStep
    ) {
      /*
       * Email -> OTP
       */
      if (
        previousStep === "email" &&
        currentStep === "otp"
      ) {
        toast.success(
          "OTP sent successfully. Please check your email."
        );
      }

      /*
       * OTP -> Reset Password
       */
      if (
        previousStep === "otp" &&
        currentStep === "reset"
      ) {
        toast.success(
          "OTP verified successfully."
        );
      }

      previousForgotStep.current =
        currentStep;
    }
  }, [
    forgotPassword.forgotPasswordStep,
  ]);


  /*
   * ============================================================
   * RESET PASSWORD STRENGTH
   * ============================================================
   */

  const isResetPasswordStrong =
    useCallback(() => {
      const requirements = [
        forgotPassword.resetPassword.length >=
          8,

        /[A-Z]/.test(
          forgotPassword.resetPassword
        ),

        /[a-z]/.test(
          forgotPassword.resetPassword
        ),

        /\d/.test(
          forgotPassword.resetPassword
        ),

        /[!@#$%^&*(),.?":{}|<>\-+=/\\[\]_]/.test(
          forgotPassword.resetPassword
        ),
      ];

      return requirements.every(
        (req) => req
      );
    }, [
      forgotPassword.resetPassword,
    ]);


  /*
   * ============================================================
   * ADMIN LOGIN
   * ============================================================
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedPassword =
      password.trim();


    /*
     * ----------------------------------------------------------
     * EMAIL VALIDATION
     * ----------------------------------------------------------
     */

    if (!normalizedEmail) {
      toast.error(
        "Please enter your email address."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      toast.error(
        "Please enter a valid email address."
      );
      return;
    }


    /*
     * ----------------------------------------------------------
     * PASSWORD VALIDATION
     * ----------------------------------------------------------
     */

    if (!normalizedPassword) {
      toast.error(
        "Please enter your password."
      );
      return;
    }


    /*
     * ----------------------------------------------------------
     * LOGIN REQUEST
     * ----------------------------------------------------------
     */

    try {
      setIsLoading(true);


      /*
       * Remember email
       */

      if (rememberMe) {
        localStorage.setItem(
          REMEMBER_ADMIN_EMAIL_KEY,
          normalizedEmail
        );
      } else {
        localStorage.removeItem(
          REMEMBER_ADMIN_EMAIL_KEY
        );
      }


      /*
       * API
       */

      const result =
        await adminLogin(
          normalizedEmail,
          normalizedPassword
        );


      /*
       * Store authentication
       */

      login(
        result.token,
        result.admin
      );


      /*
       * Success
       */

      toast.success(
        "Welcome back! Signing you in..."
      );


      /*
       * Redirect
       */

      const state =
        location.state as
          | LocationState
          | null;

      const redirectPath =
        state?.from?.pathname ||
        "/admin/dashboard";

      navigate(
        redirectPath,
        {
          replace: true,
        }
      );

    } catch (error: any) {
      console.error(
        "Admin login failed:",
        error
      );

      /*
       * --------------------------------------------------------
       * ERROR MESSAGE
       * --------------------------------------------------------
       */

      let errorMessage =
        "Unable to login. Please try again.";


      /*
       * Backend message
       */

      if (
        error?.response?.data?.message
      ) {
        errorMessage =
          error.response.data.message;

      } else if (
        error?.response?.data?.error
      ) {
        errorMessage =
          error.response.data.error;

      } else if (
        error?.message
      ) {
        errorMessage =
          error.message;
      }


      /*
       * --------------------------------------------------------
       * STATUS-SPECIFIC MESSAGES
       * --------------------------------------------------------
       */

      if (
        error?.response?.status === 401
      ) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";

      } else if (
        error?.response?.status === 404
      ) {
        errorMessage =
          "Admin account not found. Please contact support.";

      } else if (
        error?.response?.status === 429
      ) {
        errorMessage =
          "Too many login attempts. Please try again later.";

      } else if (
        error?.response?.status === 500
      ) {
        errorMessage =
          "Server error. Please try again later.";

      } else if (
        error?.code === "ERR_NETWORK"
      ) {
        errorMessage =
          "Network error. Please check your internet connection.";
      }


      /*
       * --------------------------------------------------------
       * COMMON BACKEND MESSAGE HANDLING
       * --------------------------------------------------------
       */

      const lowerMessage =
        errorMessage.toLowerCase();

      if (
        lowerMessage.includes("email") ||
        lowerMessage.includes("password") ||
        lowerMessage.includes(
          "credentials"
        )
      ) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";

      } else if (
        lowerMessage.includes(
          "not found"
        )
      ) {
        errorMessage =
          "Admin account not found. Please contact support.";
      }


      /*
       * Toast instead of inline error
       */

      toast.error(
        errorMessage
      );

    } finally {
      setIsLoading(false);
    }
  };


  /*
   * ============================================================
   * OPEN FORGOT PASSWORD
   * ============================================================
   */

  const handleOpenForgotPassword =
    () => {
      forgotPassword.setForgotEmail(
        email.trim().toLowerCase()
      );

      forgotPassword.setOtp("");

      forgotPassword.setResetToken(
        ""
      );

      forgotPassword.setResetPassword(
        ""
      );

      forgotPassword.setConfirmResetPassword(
        ""
      );

      forgotPassword.setResetExpiresAt(
        null
      );

      forgotPassword.setOtpCooldown(
        0
      );

      forgotPassword.setForgotPasswordStep(
        "email"
      );

      forgotPassword.setIsForgotPassword(
        true
      );
    };


  /*
   * ============================================================
   * SEND RESET OTP
   * ============================================================
   */

  const handleSendOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success =
      await forgotPassword.handleSendResetOtp(
        forgotPassword.forgotEmail
      );

    if (success) {
      forgotPassword.setError("");
    }
  };


  /*
   * ============================================================
   * VERIFY OTP
   * ============================================================
   */

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await forgotPassword.handleVerifyOtp(
      forgotPassword.otp
    );
  };


  /*
   * ============================================================
   * RESET PASSWORD
   * ============================================================
   */

  const handleResetPassword =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      await forgotPassword.handleResetPassword(
        forgotPassword.resetPassword,
        forgotPassword.confirmResetPassword
      );
    };


  /*
   * ============================================================
   * BACK TO LOGIN
   * ============================================================
   */

  const handleBackToLogin = () => {
    forgotPassword.resetForgotPassword();

    forgotPassword.setError("");

    toast.success(
      "Back to admin login."
    );
  };


  /*
   * ============================================================
   * FORGOT PASSWORD STEP CHANGE
   * ============================================================
   */

  const handleStepChange = (
    step: typeof forgotPassword.forgotPasswordStep
  ) => {
    forgotPassword.setForgotPasswordStep(
      step
    );

    forgotPassword.setError("");
  };


  /*
   * ============================================================
   * FORGOT PASSWORD MODAL
   * ============================================================
   */

  if (
    forgotPassword.isForgotPassword
  ) {
    return (
      <ForgotPasswordModal
        step={
          forgotPassword.forgotPasswordStep
        }

        forgotEmail={
          forgotPassword.forgotEmail
        }

        setForgotEmail={
          forgotPassword.setForgotEmail
        }

        otp={
          forgotPassword.otp
        }

        setOtp={
          forgotPassword.setOtp
        }

        resetPassword={
          forgotPassword.resetPassword
        }

        setResetPassword={
          forgotPassword.setResetPassword
        }

        confirmResetPassword={
          forgotPassword.confirmResetPassword
        }

        setConfirmResetPassword={
          forgotPassword.setConfirmResetPassword
        }

        showResetPassword={
          forgotPassword.showResetPassword
        }

        setShowResetPassword={
          forgotPassword.setShowResetPassword
        }

        showConfirmResetPassword={
          forgotPassword.showConfirmResetPassword
        }

        setShowConfirmResetPassword={
          forgotPassword.setShowConfirmResetPassword
        }

        resetExpiresAt={
          forgotPassword.resetExpiresAt
        }

        otpCooldown={
          forgotPassword.otpCooldown
        }

        isLoading={
          forgotPassword.isLoading
        }

        /*
         * Error is intentionally
         * hidden from the modal because
         * errors are shown through toast.
         */
        error=""

        onSendOtp={
          handleSendOtp
        }

        onVerifyOtp={
          handleVerifyOtp
        }

        onResetPassword={
          handleResetPassword
        }

        onResendOtp={
          forgotPassword.handleResendOtp
        }

        onBackToLogin={
          handleBackToLogin
        }

        onStepChange={
          handleStepChange
        }

        isPasswordStrong={
          isResetPasswordStrong()
        }
      />
    );
  }


  /*
   * ============================================================
   * MAIN ADMIN LOGIN
   * ============================================================
   */

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-white
        px-5
        py-10
        sm:px-6
      "
    >


      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[430px]
        "
      >

        {/* ====================================================
            BRAND / HEADER
            ==================================================== */}

        <div
          className="
            mb-7
            text-center
          "
        >

          <h1
            className="
              mt-4
              text-[25px]
              font-semibold
              tracking-tight
              text-[#2C2C2C]
              sm:text-[27px]
            "
          >
            Admin Login
          </h1>

          <p
            className="
              mt-1.5
              text-[12px]
              leading-relaxed
              text-gray-600
            "
          >
            Sign in to manage your
            GuiltFree Cravings store.
          </p>
        </div>


        {/* ====================================================
            LOGIN CARD
            ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-[#F0DDE2]
            bg-white
            p-6
            shadow-sm
            sm:p-7
          "
        >

          {/* ==================================================
              FORM
              ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================================================
                EMAIL
                ================================================ */}

            <EmailInput
              id="admin-email"
              label="Email Address"
              value={email}
              onChange={(value) => {
                setEmail(value);
              }}
              placeholder="Enter admin email"
              autoComplete="email"
              disabled={isLoading}
            />


            {/* ================================================
                PASSWORD
                ================================================ */}

            <PasswordInput
              id="admin-password"
              label="Password"
              value={password}
              onChange={(value) => {
                setPassword(value);
              }}
              showPassword={
                showPassword
              }
              setShowPassword={
                setShowPassword
              }
              placeholder="Enter admin password"
              autoComplete="current-password"
              disabled={isLoading}
            />


            {/* ================================================
                REMEMBER + FORGOT
                ================================================ */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <RememberMe
                checked={rememberMe}
                onChange={(checked) => {
                  setRememberMe(
                    checked
                  );
                }}
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={
                  handleOpenForgotPassword
                }
                disabled={isLoading}
                className="
                  text-[11px]
                  text-[#B5697A]
                  transition-colors
                  duration-200
                  hover:text-[#A55D6F]
                  hover:underline
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:text-[12px]
                "
              >
                Forgot Password?
              </button>
            </div>


            {/* ================================================
                LOGIN BUTTON
                ================================================ */}

            <button
              type="submit"
              disabled={isLoading}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B5697A]
                px-5
                py-3
                text-[12px]
                text-white
                transition-all
                duration-200
                hover:bg-[#A55D6F]
                hover:shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#B5697A]/25
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isLoading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white
                      border-t-transparent
                    "
                    aria-hidden="true"
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                </>
              )}
            </button>

          </form>


          {/* ==================================================
              SECURITY NOTE
              ================================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-1
              text-center
            "
          >
            <ShieldCheck
              className="
                h-3
                w-3
                text-[#B5697A]
              "
              strokeWidth={1.8}
            />

            <p
              className="
                text-[11px]
                text-[#A89486]
              "
            >
              Secure admin access
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}

export default AdminLoginPage;