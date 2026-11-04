import { ShoppingBag, Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Product, ProductVariant } from "../../../api/productApi";

// ─── Types ────────────────────────────────────────────────

type PackagingOption =
  | "Plastic Box"
  | "Glass Jar"
  | "Cardboard Box";

interface ProductCardPricingProps {
  product: Product;
  packaging?: PackagingOption;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
  onVariantChange?: (variant: ProductVariant | null) => void;
  discountedVariantIds?: number[];
  discountPercentage?: number;
}

// ─── Helpers ──────────────────────────────────────────────

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const calculateDiscountedPrice = (
  price: number,
  percentage: number
) => {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(percentage) ||
    percentage <= 0 ||
    percentage > 100
  ) {
    return price;
  }

  return (
    Math.round(
      (price * (1 - percentage / 100) + Number.EPSILON) * 100
    ) / 100
  );
};

// ─── Component ────────────────────────────────────────────

function ProductCardPricing({
  product,
  packaging = "Plastic Box",
  onAddToCart,
  onVariantChange,
  discountedVariantIds = [],
  discountPercentage = 20,
}: ProductCardPricingProps) {
  // ─── Available Variants ─────────────────────────────────

  const variants = useMemo(() => {
    return (product.variants ?? [])
      .filter(
        (variant) =>
          variant.packaging === packaging &&
          variant.unit?.trim().toLowerCase() === "g" &&
          Number.isFinite(Number(variant.quantity)) &&
          Number(variant.quantity) > 0 &&
          Number.isFinite(Number(variant.price)) &&
          Number(variant.price) >= 0
      )
      .sort(
        (a, b) =>
          Number(a.quantity) - Number(b.quantity) ||
          a.id - b.id
      );
  }, [product.variants, packaging]);

  // ─── Eligible Discount Variants ─────────────────────────

  const eligibleVariantIds = useMemo(
    () =>
      new Set(
        discountedVariantIds
          .map(Number)
          .filter((id) => Number.isSafeInteger(id) && id > 0)
      ),
    [discountedVariantIds]
  );

  const validDiscountPercentage =
    Number.isFinite(discountPercentage) &&
    discountPercentage > 0 &&
    discountPercentage <= 100
      ? discountPercentage
      : 0;

  // ─── Variant Selection ──────────────────────────────────

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedVariant =
    variants.find(
      (variant) => variant.id === selectedVariantId
    ) ??
    variants[0] ??
    null;

  const hasMultipleVariants = variants.length > 1;

  // ─── Discount Helpers ───────────────────────────────────

  const isDiscountEligible = (variant: ProductVariant) =>
    eligibleVariantIds.has(Number(variant.id)) &&
    validDiscountPercentage > 0;

  const getVariantPricing = (variant: ProductVariant) => {
    const originalPrice = Number(variant.price);
    const eligible = isDiscountEligible(variant);

    const discountedPrice = eligible
      ? calculateDiscountedPrice(
          originalPrice,
          validDiscountPercentage
        )
      : originalPrice;

    return {
      originalPrice,
      discountedPrice,
      eligible,
      savings: Math.max(0, originalPrice - discountedPrice),
    };
  };

  const selectedPricing = selectedVariant
    ? getVariantPricing(selectedVariant)
    : null;

  // ─── Effects ────────────────────────────────────────────

  // Reset selection when product or packaging changes.
  useEffect(() => {
    setSelectedVariantId(variants[0]?.id ?? null);
    setQuantity(1);
    setIsDropdownOpen(false);
  }, [product.id, packaging, variants]);

  // Notify parent when selected variant changes.
  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close dropdown with Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ─── Variant Validation ─────────────────────────────────

  const isValidVariant = (variant: ProductVariant) =>
    variant.packaging === packaging &&
    variant.unit?.trim().toLowerCase() === "g" &&
    Number(variant.quantity) > 0 &&
    Number.isFinite(Number(variant.price)) &&
    Number(variant.price) >= 0 &&
    variants.some((item) => item.id === variant.id);

  const handleVariantChange = (variant: ProductVariant) => {
    if (!isValidVariant(variant)) return;

    setSelectedVariantId(variant.id);
    setQuantity(1);
    setIsDropdownOpen(false);
  };

  // ─── Add to Cart ────────────────────────────────────────

  const handleAddToCart = () => {
    if (!selectedVariant || quantity < 1) return;
    if (!isValidVariant(selectedVariant)) return;

    // Keep original database price in cart.
    // Discount calculation remains separate in cart/checkout.
    onAddToCart(selectedVariant, quantity);
  };

  // ─── Empty State ────────────────────────────────────────

  if (!selectedVariant || variants.length === 0) {
    return (
      <div className="mt-auto pt-3 sm:pt-5">
        <div className="border-t border-[#EFE3D2] pt-3 sm:pt-4">
          <p className="text-[10px] font-medium text-[#8B7A6C] sm:text-[12px]">
            Currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="mt-auto min-w-0 pt-1">
      <div className="min-w-0 pt-0.5 sm:pt-1">

        {/* Single Variant: Static Size + Pricing */}
        {!hasMultipleVariants && (
          <div className="flex min-h-[32px] w-full min-w-0 items-center rounded-lg border border-[#EFE3D2] bg-white px-2 py-1 sm:min-h-[34px] sm:px-3.5">
            <div className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#B5697A] sm:text-[11px]">
                {selectedVariant.quantity}
                {selectedVariant.unit}
              </span>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="whitespace-nowrap text-[12px] font-semibold leading-none text-[#1F4A2E] sm:text-[13px]">
                  {formatPrice(
                    selectedPricing?.discountedPrice ??
                      Number(selectedVariant.price)
                  )}
                </span>

                {selectedPricing?.eligible && (
                  <span className="whitespace-nowrap text-[9px] leading-none text-[#96877D] line-through sm:text-[10px]">
                    {formatPrice(selectedPricing.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Multiple Variants: Size Dropdown */}
        {hasMultipleVariants && (
          <div ref={dropdownRef} className="relative min-w-0">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select pack size"
              className="flex min-h-[32px] w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-[#EFE3D2] bg-white px-2 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/50 focus-visible:ring-offset-1 sm:min-h-[34px] sm:gap-2 sm:px-3.5"
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#B5697A] sm:text-[11px]">
                  {selectedVariant.quantity}
                  {selectedVariant.unit}
                </span>

                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span
                    className={`whitespace-nowrap text-[12px] font-semibold leading-none sm:text-[13px] ${
                      selectedPricing?.eligible
                        ? "text-[#B5697A]"
                        : "text-[#1F4A2E]"
                    }`}
                  >
                    {formatPrice(
                      selectedPricing?.discountedPrice ??
                        Number(selectedVariant.price)
                    )}
                  </span>

                  {selectedPricing?.eligible && (
                    <span className="whitespace-nowrap text-[9px] leading-none text-[#96877D] line-through sm:text-[10px]">
                      {formatPrice(selectedPricing.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-[#8B7A6C] transition-transform duration-300 sm:h-4 sm:w-4 ${
                  isDropdownOpen ? "rotate-180 text-[#B5697A]" : ""
                }`}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div
                role="listbox"
                aria-label={`${packaging} pack sizes`}
                className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-lg border border-[#EFE3D2] bg-white shadow-lg animate-[dropdownIn_0.2s_ease-out]"
              >
                {variants.map((variant, index) => {
                  const isSelected =
                    selectedVariant.id === variant.id;

                  const pricing = getVariantPricing(variant);

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleVariantChange(variant)}
                      className={`flex w-full min-w-0 items-center gap-2 px-2.5 py-2 text-left transition-colors duration-200 sm:gap-3 sm:px-3.5 ${
                        index !== 0
                          ? "border-t border-[#F5EBE0]"
                          : ""
                      } ${
                        isSelected ? "bg-[#FBEEF1]" : ""
                      }`}
                    >
                      {/* Weight */}
                      <span
                        className={`w-[42px] shrink-0 text-[10px] uppercase tracking-wider sm:w-[52px] sm:text-[11px] ${
                          isSelected
                            ? "text-[#B5697A]"
                            : "text-[#8B7A6C]"
                        }`}
                      >
                        {variant.quantity}
                        {variant.unit}
                      </span>

                      {/* Variant Pricing */}
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span
                          className={`whitespace-nowrap text-[12px] font-semibold leading-none sm:text-[13px] ${
                            isSelected
                              ? "text-[#B5697A]"
                              : "text-[#1F4A2E]"
                          }`}
                        >
                          {formatPrice(pricing.discountedPrice)}
                        </span>

                        {pricing.eligible && (
                          <>
                            <span className="whitespace-nowrap text-[9px] leading-none text-[#96877D] line-through sm:text-[10px]">
                              {formatPrice(pricing.originalPrice)}
                            </span>

                            {/* Keep offer badge inside dropdown options */}
                            <span className="whitespace-nowrap rounded-full bg-[#FCECEF] px-1.5 py-0.5 text-[8px] font-semibold text-[#B5697A] sm:px-2 sm:text-[9px]">
                              {validDiscountPercentage}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#B5697A] sm:h-4 sm:w-4">
                          <Check
                            className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5"
                            strokeWidth={4}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <div className="mt-2 flex min-w-0 flex-col gap-2 sm:mt-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className="group/cta relative flex h-8 w-full min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-[#B5697A] px-3 text-[11px] tracking-wide text-white transition-all duration-300 hover:bg-[#A55F70] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/50 sm:h-9 sm:w-auto sm:flex-1 sm:gap-2 sm:px-4 sm:text-[12px]"
          >
            <ShoppingBag
              className="relative z-10 h-3 w-3 shrink-0 transition-transform duration-300 sm:h-3.5 sm:w-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span className="relative z-10 whitespace-nowrap">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardPricing;