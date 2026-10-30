import { X, Users, UserRound, Percent, IndianRupee, CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import toast from "react-hot-toast";

import {
  createOffer,
  updateOffer,
  type CreateOfferPayload,
  type DiscountType,
  type Offer,
  type OfferAudience,
} from "../../../api/offerApi";

// ─── Types ────────────────────────────────────────────────
interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  offer?: Offer | null;
}

// ─── Helpers ──────────────────────────────────────────────
const toDateTimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const getDefaultStartDate = () => toDateTimeLocal(new Date());

const formatDateTimeLocal = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return toDateTimeLocal(date);
};

// ─── Shared Classes ───────────────────────────────────────
const INPUT_CLASS =
  "w-full rounded-xl border border-[#E8DED3] bg-white px-4 py-2.5 text-[11px] md:text-[12px] text-slate-500 outline-none placeholder:text-slate-500 hover:border-[#D9C8BA] focus:border-[#B5697A] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

// ─── Component ────────────────────────────────────────────
function CreateOfferModal({ open, onClose, onCreated, offer }: CreateOfferModalProps) {
  const isEditMode = Boolean(offer);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [audience, setAudience] = useState<OfferAudience>("PUBLIC");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perCustomerLimit, setPerCustomerLimit] = useState("1");
  const [startsAt, setStartsAt] = useState(getDefaultStartDate());
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Populate on open
  useEffect(() => {
    if (!open) return;
    setLoading(false);

    if (offer) {
      setName(offer.name);
      setCode(offer.code);
      setAudience(offer.audience);
      setCustomerPhone(offer.customerPhone ?? "");
      setDiscountType(offer.discountType);
      setDiscountValue(String(offer.discountValue));
      setMinOrderValue(offer.minOrderValue != null ? String(offer.minOrderValue) : "");
      setMaxDiscount(offer.maxDiscount != null ? String(offer.maxDiscount) : "");
      setUsageLimit(offer.usageLimit != null ? String(offer.usageLimit) : "");
      setPerCustomerLimit(offer.perCustomerLimit != null ? String(offer.perCustomerLimit) : "1");
      setStartsAt(formatDateTimeLocal(offer.startsAt) || getDefaultStartDate());
      setExpiresAt(formatDateTimeLocal(offer.expiresAt));
      setIsActive(offer.isActive);
      return;
    }

    // Create mode
    setName(""); setCode(""); setAudience("PUBLIC"); setCustomerPhone("");
    setDiscountType("PERCENTAGE"); setDiscountValue(""); setMinOrderValue("");
    setMaxDiscount(""); setUsageLimit(""); setPerCustomerLimit("1");
    setStartsAt(getDefaultStartDate()); setExpiresAt(""); setIsActive(true);
  }, [open, offer]);

  const handleClose = () => {
    if (!loading) onClose();
  };

  // ─── Submit ─────────────────────────────────────────────
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    // Basic validation
    if (!name.trim()) return toast.error("Offer name is required.");
    if (!code.trim()) return toast.error("Offer code is required.");
    if (audience === "SPECIFIC_CUSTOMER" && !customerPhone.trim()) {
      return toast.error("Customer phone number is required.");
    }

    // Discount validation
    const numericDiscount = Number(discountValue);
    if (!Number.isInteger(numericDiscount) || numericDiscount <= 0) {
      return toast.error("Enter a valid discount value.");
    }
    if (discountType === "PERCENTAGE" && numericDiscount > 100) {
      return toast.error("Percentage discount cannot exceed 100%.");
    }

    // Optional number validation
    if (minOrderValue && (!Number.isInteger(Number(minOrderValue)) || Number(minOrderValue) < 0)) {
      return toast.error("Enter a valid minimum order value.");
    }
    if (discountType === "PERCENTAGE" && maxDiscount && (!Number.isInteger(Number(maxDiscount)) || Number(maxDiscount) <= 0)) {
      return toast.error("Enter a valid maximum discount.");
    }
    if (usageLimit && (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) <= 0)) {
      return toast.error("Enter a valid usage limit.");
    }
    if (!perCustomerLimit || !Number.isInteger(Number(perCustomerLimit)) || Number(perCustomerLimit) <= 0) {
      return toast.error("Enter a valid per-customer limit.");
    }

    // Dates validation
    if (!startsAt) return toast.error("Start date is required.");
    const parsedStart = new Date(startsAt);
    if (Number.isNaN(parsedStart.getTime())) return toast.error("Enter a valid start date.");

    let parsedExpiry: Date | null = null;
    if (expiresAt) {
      parsedExpiry = new Date(expiresAt);
      if (Number.isNaN(parsedExpiry.getTime())) return toast.error("Enter a valid expiry date.");
      if (parsedExpiry.getTime() <= parsedStart.getTime()) {
        return toast.error("Expiry date must be after the start date.");
      }
    }

    // Payload
    const payload: CreateOfferPayload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      audience,
      customerPhone: audience === "SPECIFIC_CUSTOMER" ? customerPhone.trim() : null,
      discountType,
      discountValue: numericDiscount,
      minOrderValue: minOrderValue ? Number(minOrderValue) : null,
      maxDiscount: discountType === "PERCENTAGE" && maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perCustomerLimit: perCustomerLimit ? Number(perCustomerLimit) : null,
      startsAt: parsedStart.toISOString(),
      expiresAt: parsedExpiry ? parsedExpiry.toISOString() : null,
      isActive,
    };

    // API request
    try {
      setLoading(true);
      if (offer) {
        await updateOffer(offer.id, payload);
        toast.success("Offer updated successfully.");
      } else {
        await createOffer(payload);
        toast.success("Offer created successfully.");
      }
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          (offer ? "Unable to update offer." : "Unable to create offer.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F2937]/45 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#EFE3D2] bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-gray-600 sm:text-[16px]">
                {isEditMode ? "Edit Offer" : "Create Offer"}
              </h2>
              <p className="mt-0 text-[11px] md:text-[12px] leading-relaxed text-gray-500">
                {isEditMode ? "Update the offer details and settings." : "Create a public or customer-specific offer."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close offer modal"
            title="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#A99B90] bg-[#FBECEF] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
          <div className="space-y-2 p-5 sm:p-7">
            {/* Audience selection */}
            <div className="grid gap-3 sm:grid-cols-2">
              <AudienceButton
                icon={<Users className="h-5 w-5" strokeWidth={1.8} />}
                title="Public Offer"
                subtitle="Available to eligible customers"
                isActive={audience === "PUBLIC"}
                onClick={() => setAudience("PUBLIC")}
                disabled={loading}
              />
              <AudienceButton
                icon={<UserRound className="h-5 w-5" strokeWidth={1.8} />}
                title="Specific Customer"
                subtitle="Assign by phone number"
                isActive={audience === "SPECIFIC_CUSTOMER"}
                onClick={() => setAudience("SPECIFIC_CUSTOMER")}
                disabled={loading}
              />
            </div>

            {/* Basic details */}
            <div>
              <SectionLabel>Basic Details</SectionLabel>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field value={name} onChange={setName} placeholder="Enter offer name" disabled={loading} />
                <Field
                  value={code}
                  onChange={(v) => setCode(v.toUpperCase().replace(/\s/g, ""))}
                  placeholder="Enter offer code"
                  disabled={loading}
                />
                {audience === "SPECIFIC_CUSTOMER" && (
                  <div className="sm:col-span-2">
                    <Field
                      value={customerPhone}
                      onChange={setCustomerPhone}
                      placeholder="Enter customer phone number"
                      type="tel"
                      disabled={loading}
                    />
                    <p className="mt-1.5 text-[11px] leading-5 text-[#A99B90]">
                      The offer will be linked to this phone number, even if the customer creates an account later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discount */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] text-[#6F6259]">Discount Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <DiscountTypeButton
                    icon={<Percent className="h-4 w-4" strokeWidth={1.8} />}
                    label="Percentage"
                    isActive={discountType === "PERCENTAGE"}
                    onClick={() => setDiscountType("PERCENTAGE")}
                    disabled={loading}
                  />
                  <DiscountTypeButton
                    icon={<IndianRupee className="h-4 w-4" strokeWidth={1.8} />}
                    label="Fixed"
                    isActive={discountType === "FIXED"}
                    onClick={() => setDiscountType("FIXED")}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] text-[#6F6259]">
                  {discountType === "PERCENTAGE" ? "Discount Percentage" : "Discount Amount"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "PERCENTAGE" ? "Enter percentage" : "Enter amount"}
                  disabled={loading}
                  className="h-[42px] w-full rounded-xl border border-[#E8DED3] bg-white px-4 text-[12px] text-slate-500 outline-none placeholder:text-slate-500 hover:border-[#D9C8BA] focus:border-[#B5697A] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Conditions */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Minimum Order Value" value={minOrderValue} onChange={setMinOrderValue} placeholder="500" type="number" min="0" disabled={loading} />
              {discountType === "PERCENTAGE" && (
                <Field label="Maximum Discount" value={maxDiscount} onChange={setMaxDiscount} placeholder="300" type="number" min="1" disabled={loading} />
              )}
              <Field label="Overall Usage Limit" value={usageLimit} onChange={setUsageLimit} placeholder="Unlimited" type="number" min="1" disabled={loading} />
              <Field label="Per Customer Limit" value={perCustomerLimit} onChange={setPerCustomerLimit} placeholder="1" type="number" min="1" disabled={loading} />
            </div>

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">
              <DateField label="Starts At" value={startsAt} onChange={setStartsAt} disabled={loading} />
              <DateField label="Expires At" value={expiresAt} onChange={setExpiresAt} disabled={loading} />
            </div>

            {/* Active toggle */}
            <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#EFE3D2] bg-white p-3 transition-colors hover:border-[#D9B8C1] ${loading ? "cursor-not-allowed opacity-60" : ""}`}>
              <div>
                <p className="text-[13px] text-slate-500">Activate offer</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Customers can use the offer when it is active.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={loading}
                className="h-5 w-5 shrink-0 cursor-pointer accent-[#B5697A]"
              />
            </label>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 grid grid-cols-2 shrink-0 gap-3 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl border border-[#E8DED3] bg-white px-5 py-2.5 text-[14px] text-[#6F6259] hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#A85F70] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-2.5 text-[14px] text-white shadow-sm transition-all duration-200 hover:bg-[#A85F70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                  {isEditMode ? "Update Offer" : "Create Offer"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-components (Properly Typed) ──────────────────────

interface AudienceButtonProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function AudienceButton({ icon, title, subtitle, isActive, onClick, disabled }: AudienceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border p-4 text-left focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive ? "border-[#B5697A] bg-[#FDF4F6] shadow-sm" : "border-[#EFE3D2] bg-white hover:bg-[#FFFCF8]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-[#B5697A] text-white" : "bg-[#FBECEF] text-[#B5697A]"}`}>
          {icon}
        </div>
        <div>
          <p className="text-[12px] md:text-[13px] text-gray-700">{title}</p>
          <p className="mt-0 text-[11px] leading-relaxed text-slate-500">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

interface DiscountTypeButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function DiscountTypeButton({ icon, label, isActive, onClick, disabled }: DiscountTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[42px] items-center justify-center gap-2 rounded-xl border px-3 text-[12px] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive ? "border-[#B5697A] bg-[#FBECEF] text-[#A85F70]" : "border-[#EFE3D2] bg-white text-[#8B7A6C] hover:border-[#D9B8C1]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface SectionLabelProps {
  children: ReactNode;
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <label className="mb-0 block text-[11px] md:text-[12px] font-[350] tracking-[-0.01em] text-gray-600">
      {children}
    </label>
  );
}

interface FieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  disabled?: boolean;
}

function Field({ label, value, onChange, placeholder, type = "text", min, disabled = false }: FieldProps) {
  return (
    <div>
      {label && <label className="mb-2 block text-[12px] text-slate-500">{label}</label>}
      <input
        type={type}
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

interface DateFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function DateField({ label, value, onChange, disabled = false }: DateFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-[12px] text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 text-[#B5697A]" strokeWidth={1.8} />
        {label}
      </label>
      <input
        type="datetime-local"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export default CreateOfferModal;