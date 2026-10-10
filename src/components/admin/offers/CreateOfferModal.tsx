import {
  X,
  Tag,
  Users,
  UserRound,
  Percent,
  IndianRupee,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createOffer,
  updateOffer,
  type CreateOfferPayload,
  type DiscountType,
  type Offer,
  type OfferAudience,
} from "../../../api/offerApi";

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  offer?: Offer | null;
}

// ============================================================
// DEFAULT START DATE
// ============================================================

const getDefaultStartDate = () => {
  const now = new Date();

  const offset =
    now.getTimezoneOffset() * 60000;

  return new Date(
    now.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
};

// ============================================================
// DATE HELPERS
// ============================================================

const formatDateTimeLocal = (
  value: string | null | undefined
) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset() * 60000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
};

// ============================================================
// COMPONENT
// ============================================================

function CreateOfferModal({
  open,
  onClose,
  onCreated,
  offer,
}: CreateOfferModalProps) {
  const isEditMode = Boolean(offer);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [audience, setAudience] =
    useState<OfferAudience>("PUBLIC");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [discountType, setDiscountType] =
    useState<DiscountType>("PERCENTAGE");

  const [discountValue, setDiscountValue] =
    useState("");

  const [minOrderValue, setMinOrderValue] =
    useState("");

  const [maxDiscount, setMaxDiscount] =
    useState("");

  const [usageLimit, setUsageLimit] =
    useState("");

  const [perCustomerLimit, setPerCustomerLimit] =
    useState("1");

  const [startsAt, setStartsAt] =
    useState(getDefaultStartDate());

  const [expiresAt, setExpiresAt] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================================
  // POPULATE FORM
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");
    setLoading(false);

    // --------------------------------------------------------
    // EDIT MODE
    // --------------------------------------------------------

    if (offer) {
      setName(offer.name);
      setCode(offer.code);

      setAudience(offer.audience);

      setCustomerPhone(
        offer.customerPhone ?? ""
      );

      setDiscountType(
        offer.discountType
      );

      setDiscountValue(
        String(offer.discountValue)
      );

      setMinOrderValue(
        offer.minOrderValue !== null &&
        offer.minOrderValue !== undefined
          ? String(offer.minOrderValue)
          : ""
      );

      setMaxDiscount(
        offer.maxDiscount !== null &&
        offer.maxDiscount !== undefined
          ? String(offer.maxDiscount)
          : ""
      );

      setUsageLimit(
        offer.usageLimit !== null &&
        offer.usageLimit !== undefined
          ? String(offer.usageLimit)
          : ""
      );

      setPerCustomerLimit(
        offer.perCustomerLimit !== null &&
        offer.perCustomerLimit !== undefined
          ? String(offer.perCustomerLimit)
          : "1"
      );

      setStartsAt(
        formatDateTimeLocal(
          offer.startsAt
        ) || getDefaultStartDate()
      );

      setExpiresAt(
        formatDateTimeLocal(
          offer.expiresAt
        )
      );

      setIsActive(
        offer.isActive
      );

      return;
    }

    // --------------------------------------------------------
    // CREATE MODE
    // --------------------------------------------------------

    setName("");
    setCode("");
    setAudience("PUBLIC");
    setCustomerPhone("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderValue("");
    setMaxDiscount("");
    setUsageLimit("");
    setPerCustomerLimit("1");
    setStartsAt(getDefaultStartDate());
    setExpiresAt("");
    setIsActive(true);
  }, [open, offer]);

  // ==========================================================
  // CLOSE HANDLER
  // ==========================================================

  const handleClose = () => {
    if (loading) return;

    setError("");
    onClose();
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    if (!name.trim()) {
      setError(
        "Offer name is required."
      );
      return;
    }

    if (!code.trim()) {
      setError(
        "Offer code is required."
      );
      return;
    }

    if (
      audience === "SPECIFIC_CUSTOMER" &&
      !customerPhone.trim()
    ) {
      setError(
        "Customer phone number is required."
      );
      return;
    }

    // --------------------------------------------------------
    // DISCOUNT VALIDATION
    // --------------------------------------------------------

    const numericDiscount =
      Number(discountValue);

    if (
      !Number.isInteger(numericDiscount) ||
      numericDiscount <= 0
    ) {
      setError(
        "Enter a valid discount value."
      );
      return;
    }

    if (
      discountType === "PERCENTAGE" &&
      numericDiscount > 100
    ) {
      setError(
        "Percentage discount cannot exceed 100%."
      );
      return;
    }

    // --------------------------------------------------------
    // OPTIONAL NUMBER VALIDATION
    // --------------------------------------------------------

    if (
      minOrderValue &&
      (!Number.isInteger(
        Number(minOrderValue)
      ) ||
        Number(minOrderValue) < 0)
    ) {
      setError(
        "Enter a valid minimum order value."
      );
      return;
    }

    if (
      discountType === "PERCENTAGE" &&
      maxDiscount &&
      (!Number.isInteger(
        Number(maxDiscount)
      ) ||
        Number(maxDiscount) <= 0)
    ) {
      setError(
        "Enter a valid maximum discount."
      );
      return;
    }

    if (
      usageLimit &&
      (!Number.isInteger(
        Number(usageLimit)
      ) ||
        Number(usageLimit) <= 0)
    ) {
      setError(
        "Enter a valid usage limit."
      );
      return;
    }

    if (
      !perCustomerLimit ||
      !Number.isInteger(
        Number(perCustomerLimit)
      ) ||
      Number(perCustomerLimit) <= 0
    ) {
      setError(
        "Enter a valid per-customer limit."
      );
      return;
    }

    // --------------------------------------------------------
    // START DATE VALIDATION
    // --------------------------------------------------------

    if (!startsAt) {
      setError(
        "Start date is required."
      );
      return;
    }

    const parsedStartDate =
      new Date(startsAt);

    if (
      Number.isNaN(
        parsedStartDate.getTime()
      )
    ) {
      setError(
        "Enter a valid start date."
      );
      return;
    }

    // --------------------------------------------------------
    // EXPIRY DATE VALIDATION
    // --------------------------------------------------------

    let parsedExpiryDate:
      | Date
      | null = null;

    if (expiresAt) {
      parsedExpiryDate =
        new Date(expiresAt);

      if (
        Number.isNaN(
          parsedExpiryDate.getTime()
        )
      ) {
        setError(
          "Enter a valid expiry date."
        );
        return;
      }

      if (
        parsedExpiryDate.getTime() <=
        parsedStartDate.getTime()
      ) {
        setError(
          "Expiry date must be after the start date."
        );
        return;
      }
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload: CreateOfferPayload = {
      name: name.trim(),

      code: code
        .trim()
        .toUpperCase(),

      audience,

      customerPhone:
        audience === "SPECIFIC_CUSTOMER"
          ? customerPhone.trim()
          : null,

      discountType,

      discountValue:
        numericDiscount,

      minOrderValue:
        minOrderValue
          ? Number(minOrderValue)
          : null,

      maxDiscount:
        discountType === "PERCENTAGE" &&
        maxDiscount
          ? Number(maxDiscount)
          : null,

      usageLimit:
        usageLimit
          ? Number(usageLimit)
          : null,

      perCustomerLimit:
        perCustomerLimit
          ? Number(perCustomerLimit)
          : null,

      startsAt:
        parsedStartDate.toISOString(),

      expiresAt:
        parsedExpiryDate
          ? parsedExpiryDate.toISOString()
          : null,

      isActive,
    };

    // ========================================================
    // CREATE / UPDATE
    // ========================================================

    try {
      setLoading(true);

      if (offer) {
        await updateOffer(
          offer.id,
          payload
        );
      } else {
        await createOffer(payload);
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (
            offer
              ? "Unable to update offer."
              : "Unable to create offer."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CLOSED
  // ==========================================================

  if (!open) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#1F2937]/45
        p-3
        backdrop-blur-sm
        sm:p-4
      "
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#EFE3D2]
          bg-white
          shadow-sm
          sm:rounded-3xl
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-[#EFE3D2]
            bg-white
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#FBECEF]
                text-[#B5697A]
              "
            >
              <Tag
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#1F4A2E]
                  sm:text-[18px]
                "
              >
                {isEditMode
                  ? "Edit Offer"
                  : "Create Offer"}
              </h2>

              <p
                className="
                  mt-0
                  text-[12px]
                  leading-relaxed
                  text-[#8B7A6C]
                "
              >
                {isEditMode
                  ? "Update the offer details and settings."
                  : "Create a public or customer-specific offer."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close offer modal"
            title="Close"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#A99B90]
              bg-[#FBECEF]
              hover:text-[#B5697A]
              focus:outline-none
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            min-h-0
            overflow-y-auto
          "
        >
          <div className="space-y-2 p-5 sm:p-7">

            {/* ==================================================
                AUDIENCE
            ================================================== */}

            <div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* PUBLIC */}

                <button
                  type="button"
                  onClick={() =>
                    setAudience("PUBLIC")
                  }
                  disabled={loading}
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    focus:outline-none
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      audience === "PUBLIC"
                        ? "border-[#B5697A] bg-[#FDF4F6] shadow-sm"
                        : "border-[#EFE3D2] bg-white hover:bg-[#FFFCF8]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          audience === "PUBLIC"
                            ? "bg-[#B5697A] text-white"
                            : "bg-[#FBECEF] text-[#B5697A]"
                        }
                      `}
                    >
                      <Users
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="text-[13px] text-[#3D3834]">
                        Public Offer
                      </p>

                      <p className="mt-0 text-[11px] leading-5 text-[#8B7A6C]">
                        Available to eligible customers
                      </p>
                    </div>
                  </div>
                </button>

                {/* SPECIFIC CUSTOMER */}

                <button
                  type="button"
                  onClick={() =>
                    setAudience(
                      "SPECIFIC_CUSTOMER"
                    )
                  }
                  disabled={loading}
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    focus:outline-none
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      audience ===
                      "SPECIFIC_CUSTOMER"
                        ? "border-[#B5697A] bg-[#FDF4F6] shadow-sm"
                        : "border-[#EFE3D2] bg-white hover:bg-[#FFFCF8]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          audience ===
                          "SPECIFIC_CUSTOMER"
                            ? "bg-[#B5697A] text-white"
                            : "bg-[#FBECEF] text-[#B5697A]"
                        }
                      `}
                    >
                      <UserRound
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="text-[13px] text-[#3D3834]">
                        Specific Customer
                      </p>

                      <p className="mt-0 text-[11px] leading-5 text-[#8B7A6C]">
                        Assign by phone number
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ==================================================
                BASIC DETAILS
            ================================================== */}

            <div>
              <SectionLabel>
                Basic Details
              </SectionLabel>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  value={name}
                  onChange={setName}
                  placeholder="Enter offer name"
                  disabled={loading}
                />

                <Field
                  value={code}
                  onChange={(value) =>
                    setCode(
                      value
                        .toUpperCase()
                        .replace(/\s/g, "")
                    )
                  }
                  placeholder="Enter offer code"
                  disabled={loading}
                />

                {audience ===
                  "SPECIFIC_CUSTOMER" && (
                  <div className="sm:col-span-2">
                    <Field
                      value={customerPhone}
                      onChange={setCustomerPhone}
                      placeholder="Enter customer phone number"
                      type="tel"
                      disabled={loading}
                    />

                    <p className="mt-1.5 text-[11px] leading-5 text-[#A99B90]">
                      The offer will be linked to this
                      phone number, even if the customer
                      creates an account later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                DISCOUNT
            ================================================== */}

            <div>

              <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] text-[#6F6259]">
                  Discount Type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDiscountType("PERCENTAGE")
                    }
                    disabled={loading}
                    className={`
                      flex
                      h-[45px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      px-3
                      text-[12px]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${
                        discountType === "PERCENTAGE"
                          ? "border-[#B5697A] bg-[#FBECEF] text-[#A85F70]"
                          : "border-[#EFE3D2] bg-white text-[#8B7A6C] hover:border-[#D9B8C1]"
                      }
                    `}
                  >
                    <Percent
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />

                    Percentage
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDiscountType("FIXED")
                    }
                    disabled={loading}
                    className={`
                      flex
                      h-[45px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      px-3
                      text-[12px]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${
                        discountType === "FIXED"
                          ? "border-[#B5697A] bg-[#FBECEF] text-[#A85F70]"
                          : "border-[#EFE3D2] bg-white text-[#8B7A6C] hover:border-[#D9B8C1]"
                      }
                    `}
                  >
                    <IndianRupee
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />

                    Fixed
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] text-[#6F6259]">
                  {discountType === "PERCENTAGE"
                    ? "Discount Percentage"
                    : "Discount Amount"}
                </label>

                <input
                  type="number"
                  min="1"
                  value={discountValue}
                  onChange={(event) =>
                    setDiscountValue(
                      event.target.value
                    )
                  }
                  placeholder={
                    discountType === "PERCENTAGE"
                      ? "Enter percentage"
                      : "Enter amount"
                  }
                  disabled={loading}
                  className="
                    h-[45px]
                    w-full
                    rounded-xl
                    border
                    border-[#E8DED3]
                    bg-white
                    px-4
                    text-[13px]
                    text-[#3D3834]
                    outline-none
                    placeholder:text-[#B8AAA0]
                    hover:border-[#D9C8BA]
                    focus:border-[#B5697A]
                    focus:bg-white
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>
             </div>
            </div>

            {/* ==================================================
                CONDITIONS
            ================================================== */}

            <div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Minimum Order Value"
                  value={minOrderValue}
                  onChange={setMinOrderValue}
                  placeholder="500"
                  type="number"
                  min="0"
                  disabled={loading}
                />

                {discountType ===
                  "PERCENTAGE" && (
                  <Field
                    label="Maximum Discount"
                    value={maxDiscount}
                    onChange={setMaxDiscount}
                    placeholder="300"
                    type="number"
                    min="1"
                    disabled={loading}
                  />
                )}

                <Field
                  label="Overall Usage Limit"
                  value={usageLimit}
                  onChange={setUsageLimit}
                  placeholder="Unlimited"
                  type="number"
                  min="1"
                  disabled={loading}
                />

                <Field
                  label="Per Customer Limit"
                  value={perCustomerLimit}
                  onChange={setPerCustomerLimit}
                  placeholder="1"
                  type="number"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* ==================================================
                DATES
            ================================================== */}

            <div>

              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="Starts At"
                  value={startsAt}
                  onChange={setStartsAt}
                  disabled={loading}
                />

                <DateField
                  label="Expires At"
                  value={expiresAt}
                  onChange={setExpiresAt}
                  disabled={loading}
                />
              </div>
            </div>

            {/* ==================================================
                ACTIVE
            ================================================== */}

            <label
              className={`
                flex
                cursor-pointer
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                border-[#EFE3D2]
                bg-white
                p-3
                transition-colors
                hover:border-[#D9B8C1]
                ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }
              `}
            >
              <div>
                <p className="text-[13px] text-[#3D3834]">
                  Activate offer
                </p>

                <p className="mt-0.5 text-[11px] leading-relaxed text-[#8B7A6C]">
                  Customers can use the offer when it
                  is active.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(
                    event.target.checked
                  )
                }
                disabled={loading}
                className="
                  h-5
                  w-5
                  shrink-0
                  cursor-pointer
                  accent-[#B5697A]
                "
              />
            </label>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-[#E8C8CE]
                  bg-[#FBECEF]
                  px-4
                  py-3
                  text-[12px]
                  leading-5
                  text-[#A85F70]
                "
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.8}
                />

                <p>{error}</p>
              </div>
            )}
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
      className="
        sticky
        bottom-0
        grid
        grid-cols-2
        shrink-0
        gap-3
        border-t
        border-[#EFE3D2]
        bg-white
        px-5
        py-4
        sm:px-7
      "
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-xl
          border
          border-[#E8DED3]
          bg-white
          px-5
          py-2.5
          text-[14px]          text-[#6F6259]
          hover:border-[#D9B8C1]
          hover:bg-[#FDF4F6]
          hover:text-[#A85F70]
          focus:outline-none
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#B5697A]
          px-5
          py-2.5
          text-[14px]
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:bg-[#A85F70]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin"
              strokeWidth={1.8}
            />

            {isEditMode
              ? "Updating..."
              : "Creating..."}
          </>
        ) : (
          <>
            <CheckCircle2
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            {isEditMode
              ? "Update Offer"
              : "Create Offer"}
          </>
        )}
      </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // ============================================================
    // SECTION LABEL
    // ============================================================

    function SectionLabel({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <label
          className="
            mb-0
            block
            text-[13px]
            tracking-[-0.01em]
            text-[#3D3834]
          "
        >
          {children}
        </label>
      );
    }

   // ============================================================
// FIELD
// ============================================================

interface FieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  disabled?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  disabled = false,
}: FieldProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-[12px] text-[#6F6259]">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        min={min}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-[#E8DED3]
          bg-white
          px-4
          py-3
          text-[13px]
          text-[#3D3834]
          outline-none
          placeholder:text-[#B8AAA0]
          hover:border-[#D9C8BA]
          focus:border-[#B5697A]
          focus:bg-white
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />
    </div>
  );
}

// ============================================================
// DATE FIELD
// ============================================================

interface DateFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function DateField({
  label,
  value,
  onChange,
  disabled = false,
}: DateFieldProps) {
  return (
    <div>
      <label
        className="
          mb-2
          flex
          items-center
          gap-1.5
          text-[12px]
          text-[#6F6259]
        "
      >
        <CalendarDays
          className="h-3.5 w-3.5 text-[#B5697A]"
          strokeWidth={1.8}
        />

        {label}
      </label>

      <input
        type="datetime-local"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-[#E8DED3]
          bg-white
          px-4
          py-2.5
          text-[13px]
          text-[#3D3834]
          outline-none
          hover:border-[#D9C8BA]
          focus:border-[#B5697A]
          focus:bg-white
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />
    </div>
  );
}

export default CreateOfferModal;