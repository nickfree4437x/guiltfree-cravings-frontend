import { Check } from "lucide-react";
import type { AuthStep } from "./otpAuthUtils";

// ─── Types ────────────────────────────────────────────────
interface OtpAuthHeaderProps {
  step: AuthStep;
}

// ─── Step Dot ─────────────────────────────────────────────
function StepDot({
  stepNumber,
  isActive,
  isDone,
}: {
  stepNumber: number;
  isActive: boolean;
  isDone: boolean;
}) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] transition-all duration-200 ${
        isActive ? "bg-[#B5697A] text-white" : "bg-[#F8EDEF] text-[#B5697A]"
      }`}
    >
      {isDone ? <Check size={13} strokeWidth={2.4} /> : stepNumber}
    </span>
  );
}

// ─── Step Label ───────────────────────────────────────────
function StepLabel({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      className={`text-[11px] transition-colors duration-200 sm:text-[12px] ${
        isActive ? "text-[#3A3335]" : "text-[#A69B9E]"
      }`}
    >
      {label}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────
function OtpAuthHeader({ step }: OtpAuthHeaderProps) {
  const isPhoneStep = step === "phone";

  return (
    <header className="w-full">
      {/* Title */}
      <h1 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.025em] text-[#2C2C2C] sm:text-[22px] text-center">
        Let’s Get You Started
      </h1>

      {/* Description */}
      <p className="mt-2 max-w-[400px] text-[12px] font-[400] leading-relaxed text-slate-500 sm:text-[13px] text-center">
        {isPhoneStep
          ? "Enter your mobile number to continue."
          : "Enter the 4-digit code sent to you."}
      </p>

      {/* Step indicator */}
      <div className="mt-4 flex items-center justify-center">
        {/* Step 1 — Mobile */}
        <div className="flex items-center gap-2">
          <StepDot stepNumber={1} isActive={isPhoneStep} isDone={!isPhoneStep} />
          <StepLabel label="Mobile" isActive={isPhoneStep} />
        </div>

        {/* Connector */}
        <div
          className={`mx-3 h-px w-9 transition-colors duration-200 sm:w-11 ${
            isPhoneStep ? "bg-[#E9DDE0]" : "bg-[#D7AAB5]"
          }`}
        />

        {/* Step 2 — Verification */}
        <div className="flex items-center gap-2">
          <StepDot stepNumber={2} isActive={!isPhoneStep} isDone={false} />
          <StepLabel label="Verification" isActive={!isPhoneStep} />
        </div>
      </div>
    </header>
  );
}

export default OtpAuthHeader;