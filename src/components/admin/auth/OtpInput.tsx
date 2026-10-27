// src/components/admin/auth/OtpInput.tsx

// ─── Types ────────────────────────────────────────────────
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

// ─── Component ────────────────────────────────────────────
export const OtpInput = ({ value, onChange, disabled = false }: OtpInputProps) => {
  return (
    <div className="w-full">
      <input
        id="admin-reset-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        disabled={disabled}
        aria-label="Enter 6-digit verification code"
        className="w-full rounded-xl border border-[#EADBD0] bg-white px-4 py-3 text-center text-[20px] font-semibold tracking-[0.38em] text-gray-500 outline-none transition-all duration-200 placeholder:text-[12px] placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-500 hover:border-[#D9B7C0] focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-[#FAF7F5] disabled:opacity-70"
      />

      {/* OTP status */}
      <div className="mt-2 flex justify-between">
        <span className="text-[10px] text-slate-500">
          Enter the 6-digit code sent to you.
        </span>
        <span className={`text-[10px] ${value.length === 6 ? "text-[#B5697A]" : "text-slate-500"}`}>
          {value.length}/6
        </span>
      </div>
    </div>
  );
};