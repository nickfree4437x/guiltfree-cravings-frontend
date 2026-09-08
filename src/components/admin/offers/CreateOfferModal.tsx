import {
  X,
  Tag,
  Users,
  UserRound,
  Percent,
  IndianRupee,
  CalendarDays,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createOffer,
  type CreateOfferPayload,
  type DiscountType,
  type OfferAudience,
} from "../../../api/offerApi";

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

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

function CreateOfferModal({
  open,
  onClose,
  onCreated,
}: CreateOfferModalProps) {
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

  useEffect(() => {
    if (!open) return;

    setError("");
    setLoading(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Offer name is required.");
      return;
    }

    if (!code.trim()) {
      setError("Offer code is required.");
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

    const payload: CreateOfferPayload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      audience,

      customerPhone:
        audience === "SPECIFIC_CUSTOMER"
          ? customerPhone.trim()
          : null,

      discountType,
      discountValue: numericDiscount,

      minOrderValue: minOrderValue
        ? Number(minOrderValue)
        : null,

      maxDiscount:
        discountType === "PERCENTAGE" &&
        maxDiscount
          ? Number(maxDiscount)
          : null,

      usageLimit: usageLimit
        ? Number(usageLimit)
        : null,

      perCustomerLimit:
        perCustomerLimit
          ? Number(perCustomerLimit)
          : null,

      startsAt: new Date(
        startsAt
      ).toISOString(),

      expiresAt: expiresAt
        ? new Date(
            expiresAt
          ).toISOString()
        : null,

      isActive,
    };

    try {
      setLoading(true);

      await createOffer(payload);

      onCreated();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create offer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eadfd3] px-6 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eee4] text-[#8b542f]">
                <Tag
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Create Offer
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Create a public or customer-specific offer.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-86px)] overflow-y-auto"
        >
          <div className="space-y-6 p-6 sm:p-7">
            {/* Audience */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Offer Audience
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setAudience("PUBLIC")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    audience === "PUBLIC"
                      ? "border-[#8b542f] bg-[#fdf7f1]"
                      : "border-[#eadfd3] hover:border-[#cdb8a6]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        audience === "PUBLIC"
                          ? "bg-[#8b542f] text-white"
                          : "bg-[#f8eee4] text-[#8b542f]"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Public Offer
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Available to eligible customers
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAudience(
                      "SPECIFIC_CUSTOMER"
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    audience ===
                    "SPECIFIC_CUSTOMER"
                      ? "border-[#8b542f] bg-[#fdf7f1]"
                      : "border-[#eadfd3] hover:border-[#cdb8a6]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        audience ===
                        "SPECIFIC_CUSTOMER"
                          ? "bg-[#8b542f] text-white"
                          : "bg-[#f8eee4] text-[#8b542f]"
                      }`}
                    >
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Specific Customer
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Assign by phone number
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Basic */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Offer Name"
                value={name}
                onChange={setName}
                placeholder="Summer Sale"
              />

              <Field
                label="Offer Code"
                value={code}
                onChange={(value) =>
                  setCode(
                    value
                      .toUpperCase()
                      .replace(/\s/g, "")
                  )
                }
                placeholder="SUMMER20"
              />

              {audience ===
                "SPECIFIC_CUSTOMER" && (
                <div className="sm:col-span-2">
                  <Field
                    label="Customer Phone Number"
                    value={customerPhone}
                    onChange={setCustomerPhone}
                    placeholder="9876543210"
                    type="tel"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    The offer will be linked to this
                    phone number, even if the customer
                    creates an account later.
                  </p>
                </div>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Discount
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Discount Type
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDiscountType(
                          "PERCENTAGE"
                        )
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        discountType ===
                        "PERCENTAGE"
                          ? "border-[#8b542f] bg-[#f8eee4] text-[#754527]"
                          : "border-[#eadfd3] text-slate-500"
                      }`}
                    >
                      <Percent className="h-4 w-4" />
                      Percentage
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDiscountType("FIXED")
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        discountType === "FIXED"
                          ? "border-[#8b542f] bg-[#f8eee4] text-[#754527]"
                          : "border-[#eadfd3] text-slate-500"
                      }`}
                    >
                      <IndianRupee className="h-4 w-4" />
                      Fixed
                    </button>
                  </div>
                </div>

                <Field
                  label={
                    discountType === "PERCENTAGE"
                      ? "Discount Percentage"
                      : "Discount Amount"
                  }
                  value={discountValue}
                  onChange={setDiscountValue}
                  placeholder={
                    discountType === "PERCENTAGE"
                      ? "20"
                      : "200"
                  }
                  type="number"
                  min="1"
                />
              </div>
            </div>

            {/* Conditions */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Conditions
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Minimum Order Value"
                  value={minOrderValue}
                  onChange={setMinOrderValue}
                  placeholder="500"
                  type="number"
                  min="0"
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
                  />
                )}

                <Field
                  label="Overall Usage Limit"
                  value={usageLimit}
                  onChange={setUsageLimit}
                  placeholder="Unlimited"
                  type="number"
                  min="1"
                />

                <Field
                  label="Per Customer Limit"
                  value={perCustomerLimit}
                  onChange={setPerCustomerLimit}
                  placeholder="1"
                  type="number"
                  min="1"
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Offer Validity
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="Starts At"
                  value={startsAt}
                  onChange={setStartsAt}
                />

                <DateField
                  label="Expires At"
                  value={expiresAt}
                  onChange={setExpiresAt}
                />
              </div>
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#eadfd3] bg-[#fdfbf8] p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Activate offer
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Customers can use the offer when it is active.
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
                className="h-5 w-5 accent-[#8b542f]"
              />
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#eadfd3] bg-[#fdfbf8] px-6 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#eadfd3] bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#754527] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Offer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ============================================================
// FIELD
// ============================================================

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
      />
    </div>
  );
}


// ============================================================
// DATE FIELD
// ============================================================

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function DateField({
  label,
  value,
  onChange,
}: DateFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <CalendarDays className="h-3.5 w-3.5" />
        {label}
      </label>

      <input
        type="datetime-local"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
      />
    </div>
  );
}

export default CreateOfferModal;