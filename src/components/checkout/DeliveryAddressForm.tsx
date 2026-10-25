import type { ChangeEvent } from "react";

// ─── Types ────────────────────────────────────────────────
export interface DeliveryAddress {
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  selectedZone: "WITHIN_DWARKA" | "OUTSIDE_DWARKA";
}

export type DeliveryAddressErrors = Partial<Record<keyof DeliveryAddress, string>>;

interface DeliveryAddressFormProps {
  value: DeliveryAddress;
  errors: DeliveryAddressErrors;
  disabled?: boolean;
  onChange: (field: keyof DeliveryAddress, value: string) => void;
}

// ─── Config ───────────────────────────────────────────────
const INPUT_CLASS =
  "w-full h-10 rounded-lg border border-[#EADFD3] bg-white px-4 py-2 text-[14px] text-[#2C2C2C] outline-none transition placeholder:text-slate-500 focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-gray-50";

const LABEL_CLASS = "mb-1 block text-[12px] text-[#3A3A3A] sm:text-[13px]";

const REQUIRED = <span className="text-red-500">*</span>;

// Text field config (except pincode — special input)
const TEXT_FIELDS: {
  id: keyof DeliveryAddress;
  label: string;
  autoComplete: string;
  maxLength: number;
  placeholder: string;
  required?: boolean;
  optionalNote?: string;
}[] = [
  {
    id: "addressLine1",
    label: "House / Flat / Street Address",
    autoComplete: "address-line1",
    maxLength: 200,
    placeholder: "House number, flat, street",
    required: true,
  },
  {
    id: "addressLine2",
    label: "Landmark / Additional Details",
    autoComplete: "address-line2",
    maxLength: 200,
    placeholder: "Near metro station, gate number, etc.",
    optionalNote: "(Optional)",
  },
  {
    id: "area",
    label: "Area / Locality",
    autoComplete: "address-level3",
    maxLength: 100,
    placeholder: "Sector or locality",
    required: true,
  },
];

const CITY_STATE_FIELDS = [
  {
    id: "city" as const,
    label: "City",
    autoComplete: "address-level2",
    placeholder: "New Delhi",
  },
  {
    id: "state" as const,
    label: "State",
    autoComplete: "address-level1",
    placeholder: "Delhi",
  },
];

// ─── Field Error ──────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1.5 text-xs text-red-600">{msg}</p> : null;

// ─── Component ────────────────────────────────────────────
function DeliveryAddressForm({
  value,
  errors,
  disabled = false,
  onChange,
}: DeliveryAddressFormProps) {
  const handleInputChange =
    (field: keyof DeliveryAddress) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  // ─── Render ─────────────────────────────────────────────
  return (
    <section
      aria-labelledby="delivery-address-heading"
      className="overflow-hidden rounded-xl border border-[#EEDFE2] bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-[#F1E5E7] px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF0F2] text-[#B5697A]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </div>
          <div>
            <h2 id="delivery-address-heading" className="text-lg font-semibold text-[#2C2C2C]">
              Delivery Address
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
              Where should we deliver your Guilt Free Cravings order?
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-7">
        {/* Delivery zone */}
        <div>
          <label htmlFor="delivery-zone" className={LABEL_CLASS}>
            Delivery Area {REQUIRED}
          </label>
          <select
            id="delivery-zone"
            name="selectedZone"
            value={value.selectedZone}
            onChange={handleInputChange("selectedZone")}
            disabled={disabled}
            className={INPUT_CLASS}
          >
            <option value="WITHIN_DWARKA">Within Dwarka, Delhi</option>
            <option value="OUTSIDE_DWARKA">Outside Dwarka</option>
          </select>
          <FieldError msg={errors.selectedZone} />
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Your PIN code will be checked by our server to determine the actual delivery zone.
          </p>
        </div>

        {/* Text fields (addressLine1, addressLine2, area) */}
        {TEXT_FIELDS.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={LABEL_CLASS}>
              {field.label}{" "}
              {field.required ? (
                REQUIRED
              ) : field.optionalNote ? (
                <span className="font-normal text-[#A98B6F]">{field.optionalNote}</span>
              ) : null}
            </label>
            <input
              id={field.id}
              name={field.id}
              type="text"
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              value={value[field.id] as string}
              onChange={handleInputChange(field.id)}
              disabled={disabled}
              placeholder={field.placeholder}
              aria-invalid={Boolean(errors[field.id])}
              className={INPUT_CLASS}
            />
            <FieldError msg={errors[field.id]} />
          </div>
        ))}

        {/* City + State grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CITY_STATE_FIELDS.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className={LABEL_CLASS}>
                {field.label} {REQUIRED}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                autoComplete={field.autoComplete}
                maxLength={100}
                value={value[field.id]}
                onChange={handleInputChange(field.id)}
                disabled={disabled}
                placeholder={field.placeholder}
                aria-invalid={Boolean(errors[field.id])}
                className={INPUT_CLASS}
              />
              <FieldError msg={errors[field.id]} />
            </div>
          ))}
        </div>

        {/* PIN code (special numeric input) */}
        <div>
          <label htmlFor="pincode" className={LABEL_CLASS}>
            PIN Code {REQUIRED}
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={value.pincode}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange("pincode", digits);
            }}
            disabled={disabled}
            placeholder="Enter 6-digit PIN code"
            aria-invalid={Boolean(errors.pincode)}
            className={INPUT_CLASS}
          />
          <FieldError msg={errors.pincode} />
        </div>

        {/* Delivery policy */}
        <div className="rounded-lg border border-[#EEDFE2] bg-white p-4">
          <p className="text-sm font-semibold text-[#2C2C2C]">Delivery Information</p>
          <ul className="mt-2 space-y-1 text-[10px] md:text-[12px] leading-relaxed text-slate-500">
            <li>• Within verified Dwarka delivery areas, orders above ₹500 qualify for free delivery.</li>
            <li>• For other orders, the delivery charge will be confirmed separately.</li>
            <li>• Orders outside Dwarka require manual delivery-charge confirmation.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DeliveryAddressForm;