// src/components/admin/auth/EmailInput.tsx

import { Mail } from "lucide-react";

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
    <div className="w-full">

      {/* Input */}
      <div className="relative">
        <input
          id={id}
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="
            w-full
            rounded-xl
            border
            border-[#EADBD0]
            bg-white
            px-4
            py-3
            pr-12
            text-[13px]
            text-[#2C2C2C]
            outline-none
            transition-all
            duration-200
            placeholder:text-[#B4A49A]
            hover:border-[#D9B7C0]
            focus:border-[#B5697A]
            disabled:cursor-not-allowed
            disabled:bg-[#FAF7F5]
            disabled:opacity-70
          "
        />

        {/* Email Icon */}
        <span
          className="
            pointer-events-none
            absolute
            right-2.5
            top-1/2
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-[#A89486]
            transition-colors
            duration-200
          "
        >
          <Mail
            className="h-[17px] w-[17px]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  );
};