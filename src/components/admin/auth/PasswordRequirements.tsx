// src/components/admin/auth/PasswordRequirements.tsx

import { Check, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

// ─── Types ────────────────────────────────────────────────
interface PasswordRequirementsProps {
  password: string;
}

// ─── Config ───────────────────────────────────────────────
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>\-+=/\\[\]_]/;

// ─── Component ────────────────────────────────────────────
export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = useMemo(
    () => [
      { label: "At least 8 characters", valid: password.length >= 8 },
      { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
      { label: "One lowercase letter", valid: /[a-z]/.test(password) },
      { label: "One number", valid: /\d/.test(password) },
      { label: "One special character", valid: SPECIAL_CHAR_REGEX.test(password) },
    ],
    [password]
  );

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] px-4 py-4 shadow-[0_2px_10px_rgba(181,105,122,0.03)]">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-[#2C2C2C]">
            Password Requirements
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Use a strong password for better security.
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {requirements.map((req) => (
          <div
            key={req.label}
            className={`flex min-h-[34px] items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-200 ${
              req.valid
                ? "border-[#E8C9D0] bg-[#FBEEF1]"
                : "border-[#F0E7E2] bg-white"
            }`}
          >
            {/* Status icon */}
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                req.valid ? "bg-[#B5697A] text-white" : "bg-[#F3EEEB] text-[#B4A49A]"
              }`}
            >
              {req.valid ? (
                <Check className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8BBB3]" />
              )}
            </span>

            {/* Text */}
            <span
              className={`text-[10.5px] leading-[1.4] transition-colors duration-200 ${
                req.valid ? "font-medium text-[#A55D6F]" : "text-[#8B7A6C]"
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};