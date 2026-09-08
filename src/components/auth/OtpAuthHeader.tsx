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
    <div>
      {/* =====================================================
          EYEBROW
      ====================================================== */}

      {/* =====================================================
          TITLE
      ====================================================== */}

      <h1 className="mt-3 text-[16px] md:text-[22px] font-semibold tracking-tight text-[#2c2c2c]">
        {isPhoneStep
          ? "Log in for the best experience"
          : "Log in for the best experience"}
      </h1>

      <p className="mt-2 max-w-md text-[12px] sm:text-[15px] font-[350] leading-6 text-slate-500">
        {isPhoneStep
          ? "Enter your mobile number to continue to your account."
          : "Enter the 4-digit code sent to your mobile number."}
      </p>

      {/* =====================================================
          STEP INDICATOR
      ====================================================== */}

      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              isPhoneStep
                ? "bg-[#8b542f] text-white"
                : "bg-[#f3e4d3] text-[#8b542f]"
            }`}
          >
            {isPhoneStep ? "1" : <Check size={14} />}
          </span>

          <span
            className={`text-[12px] sm:text-[13px] font-[350] ${
              isPhoneStep
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            Mobile
          </span>
        </div>

        <div
          className={`h-px w-10 transition-colors ${
            isPhoneStep
              ? "bg-[#eadfd3]"
              : "bg-[#8b542f]"
          }`}
        />

        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              !isPhoneStep
                ? "bg-[#8b542f] text-white"
                : "bg-[#f3e4d3] text-[#8b542f]"
            }`}
          >
            2
          </span>

          <span
            className={`text-[12px] sm:text-[13px] font-[350] ${
              !isPhoneStep
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            Verification
          </span>
        </div>
      </div>
    </div>
  );
}

export default OtpAuthHeader;