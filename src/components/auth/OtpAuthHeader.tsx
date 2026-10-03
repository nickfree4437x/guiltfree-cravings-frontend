import { Check } from "lucide-react";

import type { AuthStep } from "./otpAuthUtils";

interface OtpAuthHeaderProps {
  step: AuthStep;
}

function OtpAuthHeader({
  step,
}: OtpAuthHeaderProps) {
  const isPhoneStep = step === "phone";

  return (
    <header className="w-full">
      {/* =====================================================
          TITLE
      ====================================================== */}

      <h1
        className="
          text-[17px]
          font-semibold
          leading-[1.25]
          tracking-[-0.025em]
          text-[#2C2C2C]
          sm:text-[22px]
        "
      >
        Welcome Back, Let’s Get Started
      </h1>

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}

      <p
        className="
          mt-0
          max-w-[400px]
          text-[12px]
          leading-relaxed
          text-gray-500
          sm:text-[13px]
          text-center
        "
      >
        {isPhoneStep
        ? "Enter your mobile number to continue."
        : "Enter the 4-digit code sent to you."}
        </p>

      {/* =====================================================
          STEP INDICATOR
      ====================================================== */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-center
        "
      >
        {/* ===================================================
            STEP 1 — MOBILE
        ==================================================== */}

        <div className="flex items-center gap-2">
          <span
            className={`
              flex
              h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[10px]
              transition-all
              duration-200

              ${
                isPhoneStep
                  ? "bg-[#B5697A] text-white"
                  : "bg-[#F8EDEF] text-[#B5697A]"
              }
            `}
          >
            {isPhoneStep ? (
              "1"
            ) : (
              <Check
                size={13}
                strokeWidth={2.4}
              />
            )}
          </span>

          <span
            className={`
              text-[11px]
              transition-colors
              duration-200
              sm:text-[12px]

              ${
                isPhoneStep
                  ? "text-[#3A3335]"
                  : "text-[#A69B9E]"
              }
            `}
          >
            Mobile
          </span>
        </div>

        {/* ===================================================
            CONNECTOR
        ==================================================== */}

        <div
          className={`
            mx-3
            h-px
            w-9
            transition-colors
            duration-200
            sm:w-11

            ${
              isPhoneStep
                ? "bg-[#E9DDE0]"
                : "bg-[#D7AAB5]"
            }
          `}
        />

        {/* ===================================================
            STEP 2 — VERIFICATION
        ==================================================== */}

        <div className="flex items-center gap-2">
          <span
            className={`
              flex
              h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[10px]
              transition-all
              duration-200

              ${
                !isPhoneStep
                  ? "bg-[#B5697A] text-white"
                  : "bg-[#F8EDEF] text-[#B5697A]"
              }
            `}
          >
            2
          </span>

          <span
            className={`
              text-[11px]
              transition-colors
              duration-200
              sm:text-[12px]

              ${
                !isPhoneStep
                  ? "text-[#3A3335]"
                  : "text-[#A69B9E]"
              }
            `}
          >
            Verification
          </span>
        </div>
      </div>
    </header>
  );
}

export default OtpAuthHeader;