// src/components/admin/auth/EmailInput.tsx
import { Mail } from 'lucide-react';

interface EmailInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export const EmailInput = ({
  id,
  value,
  onChange,
  placeholder = "Enter email",
  autoComplete = "email",
  disabled = false,
}: EmailInputProps) => {
  return (
    <div>

      <div className="relative mt-2">
        <input
          id={id}
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-[#d9c7b7] bg-white px-4 py-2.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <Mail
          className="absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};