// src/components/admin/auth/PasswordInput.tsx

import {
  Eye,
  EyeOff,
} from "lucide-react";

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
    <div className="w-full">

      {/* =====================================================
          INPUT
          ===================================================== */}

      <div className="relative">
        <input
          id={id}
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
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

        {/* ===================================================
            SHOW / HIDE PASSWORD
            =================================================== */}

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          disabled={disabled}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-[#A89486]
            hover:text-[#B5697A]
            focus:outline-none
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {showPassword ? (
            <EyeOff
              className="h-[17px] w-[17px]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : (
            <Eye
              className="h-[17px] w-[17px]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
};