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

  onChange: (
    field: "fullName" | "email",
    value: string
  ) => void;
}

function CheckoutCustomerForm({
  formData,
  errors,
  submitError,
  isSubmitting,
  phone,
  onChange,
}: CheckoutCustomerFormProps) {
  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Customer Information
        </h2>

        <p className="mt-1 text-sm font-[350] text-slate-500">
          These details will be used for your
          order.
        </p>
      </div>

      {/* =====================================================
          VERIFIED USER
      ===================================================== */}

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
          ✓
        </div>

        <div>
          <p className="text-sm text-green-800">
            Mobile number verified
          </p>

          <p className="mt-1 text-xs leading-5 text-green-700">
            +91 {phone}
          </p>
        </div>

      </div>

      {/* =====================================================
          FORM FIELDS
      ===================================================== */}

      <div className="mt-7 space-y-6">

        {/* ===================================================
            FULL NAME
        =================================================== */}

        <div>

          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(event) =>
              onChange(
                "fullName",
                event.target.value
              )
            }
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={isSubmitting}
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.fullName
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
            }`}
          />

          {errors.fullName && (
            <p className="mt-2 text-xs text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* ===================================================
            VERIFIED MOBILE NUMBER
        =================================================== */}

        <div>

          <div className="relative mt-2">

            <input
              id="phone"
              type="tel"
              value={phone}
              readOnly
              aria-readonly="true"
              autoComplete="tel"
              className="w-full cursor-not-allowed rounded-lg border border-[#d9c7b7] bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-600 outline-none"
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
              aria-label="Verified"
            >
              ✓
            </span>

          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            This number was verified using OTP and
            cannot be changed during checkout.
          </p>
        </div>

        {/* ===================================================
            EMAIL
        =================================================== */}

        <div>

          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              onChange(
                "email",
                event.target.value
              )
            }
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={isSubmitting}
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
            }`}
          />

          {errors.email && (
            <p className="mt-2 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

      </div>

      {/* =====================================================
          API ERROR
      ===================================================== */}

      {submitError && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm leading-6 text-red-700">
            {submitError}
          </p>
        </div>
      )}

      {/* =====================================================
          INFORMATION NOTICE
      ===================================================== */}

      <div className="mt-6 rounded-lg bg-[#fffaf5] p-4">
        <p className="text-[11px] md:text-[12px] font-[350] leading-5 text-slate-500">
          Your verified mobile number will be
          associated with your order. Your email
          address will be used for order-related
          communication.
        </p>
      </div>

    </section>
  );
}

export default CheckoutCustomerForm;