import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  Product,
  ProductVariant,
} from "../../../api/productApi";

interface ProductCardPricingProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
  onAddToCart: (
    variant: ProductVariant,
    quantity: number
  ) => void;
}

function ProductCardPricing({
  product,
  packaging = "Plastic Box",
  onAddToCart,
}: ProductCardPricingProps) {
  /*
   * =========================================================
   * AVAILABLE VARIANTS
   *
   * Main product card:
   * - Plastic Box
   * - Cardboard Box
   *
   * Glass Jar collection:
   * - Glass Jar only
   * =========================================================
   */
  const variants = useMemo(
    () =>
      packaging === "Glass Jar"
        ? product.variants.filter(
            (variant) =>
              variant.packaging === "Glass Jar"
          )
        : product.variants.filter(
            (variant) =>
              variant.packaging === "Plastic Box" ||
              variant.packaging === "Cardboard Box"
          ),
    [product.variants, packaging]
  );

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(
      variants[0]?.id ?? null
    );

  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.id === selectedVariantId
    ) ??
    variants[0] ??
    null;

  useEffect(() => {
    setSelectedVariantId(
      variants[0]?.id ?? null
    );
    setQuantity(1);
    setIsDropdownOpen(false);
  }, [packaging, product.id, variants]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const handleVariantChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariantId(variant.id);
    setQuantity(1);
    setIsDropdownOpen(false);
  };

  const handleDecrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleIncrease = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    onAddToCart(
      selectedVariant,
      quantity
    );
  };

  if (variants.length === 0) {
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

  return (
    <div className="mt-auto pt-2 sm:pt-3">
      <div className="pt-1 sm:pt-2">

        {/* ============= SIZE DROPDOWN ============= */}
        <div>
          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsDropdownOpen(
                  (current) => !current
                )
              }
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select pack size"
              className="
                group/trigger relative flex w-full
                items-center justify-between gap-2
                rounded-md border border-[#EFE3D2] bg-white
                px-2.5 py-0.5
                text-left
                focus:outline-none
                focus-visible:ring-[#B5697A]/50
                focus-visible:ring-offset-1
                sm:rounded-lg sm:px-3.5 sm:py-1
              "
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span
                  className="
                    flex h-6 min-w-[44px] items-center justify-center
                    px-1.5 text-[10px] uppercase tracking-wider
                    text-[#B5697A]
                    sm:h-7 sm:min-w-[52px] sm:rounded-lg sm:px-2 sm:text-[11px]
                  "
                >
                  {selectedVariant?.quantity}
                  {selectedVariant?.unit}
                </span>

                <span className="truncate text-[12px] font-semibold leading-none text-[#1F4A2E] sm:text-[13.5px]">
                  ₹{selectedVariant?.price}
                </span>
              </div>

              <ChevronDown
                className={`
                  h-3.5 w-3.5 flex-shrink-0 text-[#8B7A6C]
                  transition-transform duration-300
                  sm:h-4 sm:w-4
                  ${
                    isDropdownOpen
                      ? "rotate-180 text-[#B5697A]"
                      : ""
                  }
                `}
                strokeWidth={2.2}
              />
            </button>

            {isDropdownOpen && (
              <div
                role="listbox"
                className="
                  absolute left-0 right-0 z-50 mt-1.5
                  overflow-hidden rounded-lg
                  border border-[#EFE3D2] bg-white
                  shadow-[0_16px_40px_-12px_rgba(139,111,92,0.22)]
                  animate-[dropdownIn_0.2s_ease-out]
                  sm:rounded-lg
                "
              >
                {variants.map(
                  (variant, index) => {
                    const isSelected =
                      selectedVariant?.id ===
                      variant.id;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="option"
                        aria-selected={
                          isSelected
                        }
                        onClick={() =>
                          handleVariantChange(
                            variant
                          )
                        }
                        className={`
                          flex w-full items-center justify-between
                          gap-2 px-2.5 py-2
                          text-left
                          transition-colors duration-200
                          sm:gap-3 sm:px-3.5 sm:py-2.5
                          ${
                            index !== 0
                              ? "border-t border-[#F5EBE0]"
                              : ""
                          }
                          ${
                            isSelected
                              ? "bg-[#FBEEF1]"
                              : "hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className={`
                              text-[10px] uppercase tracking-wider
                              sm:text-[11px]
                              ${
                                isSelected
                                  ? "text-[#B5697A]"
                                  : "text-[#8B7A6C]"
                              }
                            `}
                          >
                            {variant.quantity}
                            {variant.unit}
                          </span>

                          <span
                            className={`
                              text-[12px] font-semibold sm:text-[13px]
                              ${
                                isSelected
                                  ? "text-[#B5697A]"
                                  : "text-[#1F4A2E]"
                              }
                            `}
                          >
                            ₹{variant.price}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#B5697A] sm:h-4 sm:w-4">
                            <Check
                              className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5"
                              strokeWidth={4}
                            />
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============= QUANTITY + ADD TO CART ============= */}
        {selectedVariant && (
          <div
            className="
              mt-2.5 flex gap-2
              flex-col sm:mt-4 sm:flex-row sm:items-center
              sm:gap-2
            "
          >
            {/* Quantity Stepper */}
            <div
              className="
                flex h-7 w-full items-center justify-between overflow-hidden
                rounded-lg border border-[#EFE3D2]
                bg-white
                transition-colors duration-200
                hover:border-[#DCCFC3]
                sm:h-8 sm:w-auto sm:rounded-lg
              "
            >
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="
                  flex h-full flex-1 items-center justify-center
                  text-[#8B7A6C]
                  transition-all duration-200
                  hover:bg-[#FBEEF1] hover:text-[#B5697A]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                  disabled:hover:bg-transparent
                  sm:w-8 sm:flex-none
                "
              >
                <Minus
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  strokeWidth={2.5}
                />
              </button>

              <span
                className="
                  min-w-[28px] text-center text-[12px] font-semibold text-[#1F4A2E]
                  sm:min-w-[26px] sm:text-[13px]
                "
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
                className="
                  flex h-full flex-1 items-center justify-center
                  text-[#8B7A6C]
                  transition-all duration-200
                  hover:bg-[#FBEEF1] hover:text-[#B5697A]
                  sm:w-8 sm:flex-none
                "
              >
                <Plus
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Add To Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                group/cta relative flex h-8 w-full
                items-center justify-center gap-1.5
                overflow-hidden rounded-lg
                bg-[#B5697A] px-3
                text-[11px] tracking-wide text-white
                transition-all duration-300
                hover:bg-[#A55F70]
                hover:shadow-sm
                focus:outline-none
                sm:h-9 sm:w-auto sm:flex-1 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-[12px]
              "
            >
              <ShoppingBag
                className="
                  relative z-10 h-3 w-3
                  transition-transform duration-300
                  sm:h-3.5 sm:w-3.5
                "
                strokeWidth={2}
              />

              <span className="relative z-10 whitespace-nowrap">
                Add to Cart
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardPricing;