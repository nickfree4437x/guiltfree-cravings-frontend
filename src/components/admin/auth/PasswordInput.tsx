// src/components/admin/auth/PasswordInput.tsx

import { Eye, EyeOff } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────
export const PasswordInput = ({
  id,
  value,
  onChange,
  showPassword,
  setShowPassword,
  placeholder = "Enter password",
  autoComplete = "current-password",
  disabled = false,
}: PasswordInputProps) => {
  const Icon = showPassword ? EyeOff : Eye;
  const toggleLabel = showPassword ? "Hide password" : "Show password";

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-xl border border-[#EADBD0] bg-white px-4 py-3 pr-12 text-[13px] text-gray-600 outline-none transition-all duration-200 placeholder:text-gray-500 hover:border-[#D9B7C0] focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-[#FAF7F5] disabled:opacity-70"
      />

      {/* Show/hide toggle */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        aria-label={toggleLabel}
        title={toggleLabel}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
};