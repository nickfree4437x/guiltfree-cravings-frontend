

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
  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  return (
    <div className="mt-8">
      {/* =====================================================
          PHONE FIELD
      ====================================================== */}

      <div
        className={`mt-2 flex h-[46px] overflow-hidden rounded-md border bg-white transition-all ${
          phone.length > 0 && isValidPhone
            ? "border-[#8b542f] ring-[#8b542f]/10"
            : "border-[#d9c9bb] focus-within:border-[#8b542f] focus-within:ring-[#8b542f]/10"
        }`}
      >
        {/* COUNTRY */}

        <div className="flex items-center border-r border-[#eadfd3] px-4">
          <span className="text-[12px] font-[350] text-[#2c2c2c] md:text-[14px]">
            +91
          </span>
        </div>

        {/* INPUT */}

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
          placeholder="Phone Number"
          maxLength={10}
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent px-4 text-base text-[#2c2c2c] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Phone Number"
        />
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          role="alert"
          className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2"
        >
          <p className="text-[10px] font-[350] leading-5 text-red-600 md:text-[12px]">
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          HELPER
      ====================================================== */}

      <p className="mt-8 text-center text-[12px] font-[350] leading-5 text-slate-500 md:text-[13px]">
        Your mobile number is safe with us and is used only for secure account verification and login.
      </p>

      {/* =====================================================
          CONTINUE
      ====================================================== */}

      <button
        type="button"
        onClick={onSendOtp}
        disabled={loading}
        className="mt-28 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#8b542f] px-5 text-sm text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#cdb9a8] disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            <span>Sending OTP...</span>
          </>
        ) : (
          <>
            <span>Continue</span>
          </>
        )}
      </button>
    </div>
  );
}

export default OtpPhoneStep;