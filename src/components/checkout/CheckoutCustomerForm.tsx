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
    <section className="w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="">
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F8E8EC]
              text-[#B5697A]
            "
            aria-hidden="true"
          >
            <span className="text-sm font-semibold">
              1
            </span>
          </div>

          <div>
            <h2
              className="
                text-[17px]
                font-semibold
                tracking-[-0.01em]
                text-[#2C2C2C]
                sm:text-[18px]
              "
            >
              Customer Information
            </h2>

            <p
              className="
                text-[11px]
                leading-relaxed
                text-slate-500
                sm:text-xs
              "
            >
              These details will be used for your
              order.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          VERIFIED USER
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-[#DCEFE5]
          bg-[#F5FBF8]
          p-3.5
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#E3F4EB]
            text-sm
            font-bold
            text-[#3D8B63]
          "
        >
          ✓
        </div>

        <div className="min-w-0">
          <p
            className="
              text-[12px]
              text-[#367A58]
              sm:text-[13px]
            "
          >
            Mobile number verified
          </p>

          <p
            className="
              text-[11px]
              leading-5
              text-[#5D987A]
            "
          >
            +91 {phone}
          </p>
        </div>
      </div>

      {/* =====================================================
          FORM FIELDS
      ===================================================== */}

      <div className="mt-5 space-y-5">
        {/* ===================================================
            FULL NAME
        =================================================== */}

        <div>
          <label
            htmlFor="fullName"
            className="
              block
              text-[12px]
              text-[#3A3A3A]
              sm:text-[13px]
            "
          >
            Full name
          </label>

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
            className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#2C2C2C] outline-none transition-all placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.fullName
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#E6D9DC] focus:border-[#B5697A] focus:ring-[#F8E8EC]"
            }`}
          />

          {errors.fullName && (
            <p
              className="
                mt-1.5
                text-[11px]
                leading-5
                text-red-600
              "
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* ===================================================
            VERIFIED MOBILE NUMBER
        =================================================== */}

        <div>
          <label
            htmlFor="phone"
            className="
              block
              text-[12px]
              text-[#3A3A3A]
              sm:text-[13px]
            "
          >
            Mobile number
          </label>

          <div className="relative mt-2">
            <input
              id="phone"
              type="tel"
              value={phone}
              readOnly
              aria-readonly="true"
              autoComplete="tel"
              className="
                h-11
                w-full
                cursor-not-allowed
                rounded-xl
                border
                border-[#E6D9DC]
                bg-[#FAF8F8]
                px-3.5
                pr-11
                text-[13px]
                text-slate-500
                outline-none
              "
            />

            <span
              className="
                absolute
                right-3.5
                top-1/2
                flex
                h-5
                w-5
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-[#E3F4EB]
                text-[10px]
                text-[#3D8B63]
              "
              aria-label="Verified"
            >
              ✓
            </span>
          </div>
        </div>

        {/* ===================================================
            EMAIL
        =================================================== */}

        <div className="">
          <label
            htmlFor="email"
            className="
              block
              text-[12px]
              text-[#3A3A3A]
              sm:text-[13px]
            "
          >
            Email address
          </label>

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
            className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#2C2C2C] outline-none transition-all placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#E6D9DC] focus:border-[#B5697A] focus:ring-[#F8E8EC]"
            }`}
          />

          {errors.email && (
            <p
              className="
                mt-1.5
                text-[11px]
                leading-5
                text-red-600
              "
            >
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
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
        >
          <p
            className="
              text-[11px]
              leading-5
              text-red-700
              sm:text-xs
            "
          >
            {submitError}
          </p>
        </div>
      )}
    </section>
  );
}

export default CheckoutCustomerForm;