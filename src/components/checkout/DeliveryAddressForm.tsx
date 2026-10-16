import type { ChangeEvent } from "react";

export interface DeliveryAddress {
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  selectedZone: "WITHIN_DWARKA" | "OUTSIDE_DWARKA";
}

export type DeliveryAddressErrors = Partial<
  Record<keyof DeliveryAddress, string>
>;

interface DeliveryAddressFormProps {
  value: DeliveryAddress;
  errors: DeliveryAddressErrors;
  disabled?: boolean;
  onChange: (
    field: keyof DeliveryAddress,
    value: string
  ) => void;
}

const inputClassName =
  "w-full h-10 rounded-lg border border-[#EADFD3] bg-white px-4 py-2 text-[14px] text-[#2C2C2C] outline-none transition placeholder:text-slate-500 focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-gray-50";

const labelClassName =
  "mb-1 block text-[12px] text-[#3A3A3A] sm:text-[13px]";

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

  return (
    <section
      aria-labelledby="delivery-address-heading"
      className="overflow-hidden rounded-xl border border-[#EEDFE2] bg-white shadow-sm"
    >
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
            <h2
              id="delivery-address-heading"
              className="text-lg font-semibold text-[#2C2C2C]"
            >
              Delivery Address
            </h2>

            <p className="text-[11px]
                leading-relaxed
                text-slate-600
                sm:text-xs">
              Where should we deliver your Guilt Free Cravings order?
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-7">
        {/* Delivery zone */}
        <div>
          <label
            htmlFor="delivery-zone"
            className={labelClassName}
          >
            Delivery Area <span className="text-red-500">*</span>
          </label>

          <select
            id="delivery-zone"
            name="selectedZone"
            value={value.selectedZone}
            onChange={handleInputChange("selectedZone")}
            disabled={disabled}
            className={inputClassName}
          >
            <option value="WITHIN_DWARKA">
              Within Dwarka, Delhi
            </option>

            <option value="OUTSIDE_DWARKA">
              Outside Dwarka
            </option>
          </select>

          {errors.selectedZone && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.selectedZone}
            </p>
          )}

          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Your PIN code will be checked by our server to determine
            the actual delivery zone.
          </p>
        </div>

        {/* Address line 1 */}
        <div>
          <label
            htmlFor="addressLine1"
            className={labelClassName}
          >
            House / Flat / Street Address{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            autoComplete="address-line1"
            maxLength={200}
            value={value.addressLine1}
            onChange={handleInputChange("addressLine1")}
            disabled={disabled}
            placeholder="House number, flat, street"
            aria-invalid={Boolean(errors.addressLine1)}
            className={inputClassName}
          />

          {errors.addressLine1 && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.addressLine1}
            </p>
          )}
        </div>

        {/* Address line 2 */}
        <div>
          <label
            htmlFor="addressLine2"
            className={labelClassName}
          >
            Landmark / Additional Details{" "}
            <span className="font-normal text-[#A98B6F]">
              (Optional)
            </span>
          </label>

          <input
            id="addressLine2"
            name="addressLine2"
            type="text"
            autoComplete="address-line2"
            maxLength={200}
            value={value.addressLine2}
            onChange={handleInputChange("addressLine2")}
            disabled={disabled}
            placeholder="Near metro station, gate number, etc."
            className={inputClassName}
          />
        </div>

        {/* Area */}
        <div>
          <label
            htmlFor="area"
            className={labelClassName}
          >
            Area / Locality <span className="text-red-500">*</span>
          </label>

          <input
            id="area"
            name="area"
            type="text"
            autoComplete="address-level3"
            maxLength={100}
            value={value.area}
            onChange={handleInputChange("area")}
            disabled={disabled}
            placeholder="Sector or locality"
            aria-invalid={Boolean(errors.area)}
            className={inputClassName}
          />

          {errors.area && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.area}
            </p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className={labelClassName}
            >
              City <span className="text-red-500">*</span>
            </label>

            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              maxLength={100}
              value={value.city}
              onChange={handleInputChange("city")}
              disabled={disabled}
              placeholder="New Delhi"
              aria-invalid={Boolean(errors.city)}
              className={inputClassName}
            />

            {errors.city && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className={labelClassName}
            >
              State <span className="text-red-500">*</span>
            </label>

            <input
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              maxLength={100}
              value={value.state}
              onChange={handleInputChange("state")}
              disabled={disabled}
              placeholder="Delhi"
              aria-invalid={Boolean(errors.state)}
              className={inputClassName}
            />

            {errors.state && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.state}
              </p>
            )}
          </div>
        </div>

        {/* PIN code */}
        <div>
          <label
            htmlFor="pincode"
            className={labelClassName}
          >
            PIN Code <span className="text-red-500">*</span>
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
            onChange={(event) => {
              const digits = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

              onChange("pincode", digits);
            }}
            disabled={disabled}
            placeholder="Enter 6-digit PIN code"
            aria-invalid={Boolean(errors.pincode)}
            className={inputClassName}
          />

          {errors.pincode && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.pincode}
            </p>
          )}
        </div>

        {/* Delivery policy */}
        <div className="rounded-lg border border-[#EEDFE2] bg-white p-4">
          <p className="text-sm font-semibold text-[#2C2C2C]">
            Delivery Information
          </p>

          <ul className="mt-2 space-y-1 text-[10px] md:text-[12px] leading-relaxed text-slate-500">
            <li>
              • Within verified Dwarka delivery areas, orders above
              ₹500 qualify for free delivery.
            </li>

            <li>
              • For other orders, the delivery charge will be
              confirmed separately.
            </li>

            <li>
              • Orders outside Dwarka require manual delivery-charge
              confirmation.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DeliveryAddressForm;