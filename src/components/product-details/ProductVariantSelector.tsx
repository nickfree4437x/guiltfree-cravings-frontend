import type { ProductVariant } from "../../api/productApi";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onChange: (
    variant: ProductVariant
  ) => void;
}

function ProductVariantSelector({
  variants,
  selectedVariant,
  onChange,
}: ProductVariantSelectorProps) {
  if (variants.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-sm text-[#8B7A6C]">
          No sizes are currently available for this packaging.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8B7A6C]">
        Select Size
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {variants.map((variant) => {
          const isSelected =
            selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() =>
                onChange(variant)
              }
              aria-pressed={isSelected}
              className={`
                flex
                flex-col
                items-start
                rounded-xl
                border
                px-4
                py-3
                text-left
                transition-all
                duration-200
                ${
                  isSelected
                    ? "border-[#B5697A] bg-[#FBEEF1]"
                    : "border-[#EFE3D2] bg-white hover:border-[#D9C7B8]"
                }
              `}
            >
              <span
                className={`
                  text-sm font-semibold
                  ${
                    isSelected
                      ? "text-[#B5697A]"
                      : "text-[#1F4A2E]"
                  }
                `}
              >
                {variant.quantity}
                {variant.unit}
              </span>

              <span className="mt-1 text-xs text-[#8B7A6C]">
                ₹{variant.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductVariantSelector;