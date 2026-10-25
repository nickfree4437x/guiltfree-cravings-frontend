// ─── Types ────────────────────────────────────────────────
interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
}

interface CheckoutErrors {
  fullName: string;
  email: string;
}

interface CheckoutCustomerFormProps {
  formData: CheckoutFormData;
  errors: CheckoutErrors;
  submitError: string;
  isSubmitting: boolean;
  phone: string;
  onChange: (field: "fullName" | "email", value: string) => void;
}

// ─── Input Class Helper ───────────────────────────────────
const inputClass = (hasError: boolean) =>
  `mt-1 h-10 w-full rounded-lg border bg-white px-3.5 text-[14px] text-[#2C2C2C] outline-none transition-all placeholder:text-slate-400 placeholder:font-[350] disabled:cursor-not-allowed disabled:bg-slate-50 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-[#E6D9DC] focus:border-[#B5697A] focus:ring-[#F8E8EC]"
  }`;

// ─── Component ────────────────────────────────────────────
function CheckoutCustomerForm({
  formData,
  errors,
  submitError,
  isSubmitting,
  phone,
  onChange,
}: CheckoutCustomerFormProps) {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8E8EC] text-[#B5697A]"
        >
          <span className="text-sm font-semibold">1</span>
        </div>
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#2C2C2C] sm:text-[18px]">
            Customer Information
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            These details will be used for your order.
          </p>
        </div>
      </div>

      {/* Verified user */}
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#DCEFE5] bg-[#F5FBF8] p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F4EB] text-sm font-bold text-[#3D8B63]">
          ✓
        </div>
        <div className="min-w-0">
          <p className="text-[12px] text-[#367A58] sm:text-[13px]">
            Mobile number verified
          </p>
          <p className="text-[11px] leading-5 text-[#5D987A]">+91 {phone}</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="mt-2 space-y-4">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className="block text-[12px] text-[#3A3A3A] sm:text-[13px]">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={isSubmitting}
            className={inputClass(Boolean(errors.fullName))}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-[11px] leading-5 text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Verified mobile */}
        <div>
          <label htmlFor="phone" className="block text-[12px] text-[#3A3A3A] sm:text-[13px]">
            Mobile number
          </label>
          <div className="relative mt-1">
            <input
              id="phone"
              type="tel"
              value={phone}
              readOnly
              aria-readonly="true"
              autoComplete="tel"
              className="h-10 w-full cursor-not-allowed rounded-lg border border-[#E6D9DC] bg-[#FAF8F8] px-3.5 pr-11 text-[14px] text-slate-500 outline-none"
            />
            <span
              aria-label="Verified"
              className="absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#E3F4EB] text-[10px] text-[#3D8B63]"
            >
              ✓
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[12px] text-[#3A3A3A] sm:text-[13px]">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={isSubmitting}
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && (
            <p className="mt-1.5 text-[11px] leading-5 text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* API error */}
      {submitError && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[11px] leading-5 text-red-700 sm:text-xs">
            {submitError}
          </p>
        </div>
      )}
    </section>
  );
}

export default CheckoutCustomerForm;