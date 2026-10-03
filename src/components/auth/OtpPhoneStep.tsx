interface OtpPhoneStepProps {
  phone: string;
  loading: boolean;
  error: string;
  onPhoneChange: (value: string) => void;
  onSendOtp: () => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

function OtpPhoneStep({
  phone,
  loading,
  error,
  onPhoneChange,
  onSendOtp,
  onKeyDown,
}: OtpPhoneStepProps) {
  const isValidPhone =
    /^[6-9]\d{9}$/.test(phone);

  return (
    <div className="w-full">
      {/* =====================================================
          PHONE FIELD
      ====================================================== */}

      <div
        className={`
          flex
          h-[45px]
          w-full
          overflow-hidden
          rounded-xl
          border
          bg-white
          transition-all
          duration-200

          ${
            phone.length > 0 && isValidPhone
              ? "border-[#D4AAB4] bg-[#FFFBFC]"
              : "border-[#E8DCDF] focus-within:border-[#B5697A] focus-within:ring-[#B5697A]/10"
          }

          ${
            loading
              ? "opacity-70"
              : ""
          }
        `}
      >
        {/* =================================================
            COUNTRY CODE
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            border-r border-[#EDE1E4]
            bg-[#FFFBFC]
            px-3.5
            sm:px-4
          "
        >
          <span
            className="
              text-[12px]
              font-semibold
              tracking-[-0.01em]
              text-[#3A3335]
              sm:text-[13px]
            "
          >
            +91
          </span>
        </div>

        {/* =================================================
            PHONE INPUT
        ================================================== */}

        <input
          id="auth-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(event) =>
            onPhoneChange(event.target.value)
          }
          onKeyDown={onKeyDown}
          placeholder="Enter mobile number"
          maxLength={10}
          disabled={loading}
          className="
            min-w-0
            flex-1
            bg-transparent
            px-3.5
            text-[13px]
            text-[#2C2C2C]
            outline-none
            placeholder:font-normal
            placeholder:text-[#A69B9E]
            disabled:cursor-not-allowed
            sm:px-4
            sm:text-[14px]
          "
          aria-label="Phone Number"
        />
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          role="alert"
          className="
            mt-2
            rounded-[10px]
            border
            border-[#F2D9DD]
            bg-[#FFF7F8]
            px-3
            py-2
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              text-[#B75F70]
              sm:text-[12px]
            "
          >
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          HELPER TEXT
      ====================================================== */}

      <p
        className="
          mt-3
          max-w-[390px]
          text-[10px]
          leading-relaxed
          text-gray-600
          sm:text-[11px]
          text-center
        "
      >
        Your number is safe and used only for secure login
      </p>

      {/* =====================================================
          CONTINUE
      ====================================================== */}

      <button
        type="button"
        onClick={onSendOtp}
        disabled={loading}
        className="
          mt-6
          flex
          h-[46px]
          w-full
          items-center
          justify-center
          gap-2
          rounded-[12px]
          bg-[#B5697A]
          px-5
          text-[13px]
          text-white
          transition-all
          duration-200
          hover:bg-[#A85D6F]
          hover:shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#B5697A]/25
          focus:ring-offset-2
          disabled:cursor-not-allowed
          disabled:bg-[#D7AEB8]
          disabled:shadow-none
        "
      >
        {loading ? (
          <>
            <span
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-white/35
                border-t-white
              "
            />

            <span>
              Sending OTP...
            </span>
          </>
        ) : (
          <span>
            Continue
          </span>
        )}
      </button>
    </div>
  );
}

export default OtpPhoneStep;