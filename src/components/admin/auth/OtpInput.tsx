// src/components/admin/auth/OtpInput.tsx
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const OtpInput = ({ value, onChange, disabled = false }: OtpInputProps) => {
  return (
    <div>
      <input
        id="admin-reset-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={(event) => {
          const newValue = event.target.value.replace(/\D/g, "").slice(0, 6);
          onChange(newValue);
        }}
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-[#d9c7b7] bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3] disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </div>
  );
};