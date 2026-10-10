// src/components/admin/auth/OtpInput.tsx

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const OtpInput = ({
  value,
  onChange,
  disabled = false,
}: OtpInputProps) => {
  return (
    <div className="w-full">

      {/* =====================================================
          OTP INPUT
          ===================================================== */}

      <div className="relative">
        <input
          id="admin-reset-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={value}
          onChange={(event) => {
            const newValue =
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

            onChange(newValue);
          }}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          disabled={disabled}
          className="
            w-full
            rounded-xl
            border
            border-[#EADBD0]
            bg-white
            px-4
            py-3
            text-center
            text-[20px]
            font-semibold
            tracking-[0.38em]
            text-[#2C2C2C]
            outline-none
            transition-all
            duration-200
            placeholder:text-[12px]
            placeholder:font-normal
            placeholder:tracking-normal
            placeholder:text-[#B4A49A]
            hover:border-[#D9B7C0]
            focus:border-[#B5697A]
            disabled:cursor-not-allowed
            disabled:bg-[#FAF7F5]
            disabled:opacity-70
          "
          aria-label="Enter 6-digit verification code"
        />
      </div>

      {/* =====================================================
          OTP STATUS
          ===================================================== */}

      <div className="mt-2 flex justify-between">
        <span
          className="
            text-[9.5px]
            text-[#A89486]
          "
        >
          Enter the 6-digit code sent to you.
        </span>

        <span
          className={`
            text-[9.5px]
            font-medium
            ${
              value.length === 6
                ? "text-[#B5697A]"
                : "text-[#B4A49A]"
            }
          `}
        >
          {value.length}/6
        </span>
      </div>
    </div>
  );
};