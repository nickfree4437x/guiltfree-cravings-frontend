// src/components/admin/auth/EmailInput.tsx

import { Mail } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
interface EmailInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────
export const EmailInput = ({
  id,
  value,
  onChange,
  placeholder = "Enter email",
  autoComplete = "email",
  disabled = false,
}: EmailInputProps) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-xl border border-[#EADBD0] bg-white px-4 py-3 pr-12 text-[13px] text-gray-600 outline-none transition-all duration-200 placeholder:text-gray-500 hover:border-[#D9B7C0] focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-[#FAF7F5] disabled:opacity-70"
      />

      {/* Email icon */}
      <span className="pointer-events-none absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200">
        <Mail className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>
  );
};