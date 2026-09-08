// src/components/admin/auth/PasswordInput.tsx
import { Eye, EyeOff } from 'lucide-react';

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
  return (
    <div>

      <div className="relative mt-2">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-[#d9c7b7] bg-white px-4 py-2.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};