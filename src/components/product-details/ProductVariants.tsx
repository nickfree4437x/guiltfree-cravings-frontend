import type {
  ProductVariant,
} from "../../api/productApi";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant:
    | ProductVariant
    | null;
  formatQuantity: (
    variant: ProductVariant
  ) => string;
  onVariantChange: (
    variant: ProductVariant
  ) => void;
}

function ProductVariants({
  variants,
  selectedVariant,
  formatQuantity,
  onVariantChange,
}: ProductVariantsProps) {
  return (
    <section className="mt-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] md:text-[14px] font-bold text-slate-900">
            Choose your size
          </p>

          <p className="mt-1 text-xs font-[350] text-slate-500">
            Select the pack that suits you best.
          </p>
        </div>

        {selectedVariant && (
          <span className="hidden text-xs capitalize text-[#8b542f] sm:block">
            {selectedVariant.packaging}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {variants.map((variant) => {
          const isSelected =
            selectedVariant?.id ===
            variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() =>
                onVariantChange(
                  variant
                )
              }
              aria-pressed={
                isSelected
              }
              className={`group relative min-h-[104px] rounded-xl border p-4 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 ${
                isSelected
                  ? "border-[#8b542f] bg-[#f8eee4]"
                  : "border-[#eadfd3] bg-white hover:border-[#c9aa91] hover:bg-[#fffaf5]"
              }`}
            >

              <span
                className={`block pr-6 text-sm font-bold ${
                  isSelected
                    ? "text-[#8b542f]"
                    : "text-slate-900"
                }`}
              >
                {formatQuantity(
                  variant
                )}
              </span>

              <span className="mt-2 block text-[10px] md:text-[12px] font-bold text-slate-800">
                ₹{variant.price}
              </span>

              <span className="mt-1.5 block text-[11px] font-[350] capitalize text-slate-400">
                {variant.packaging}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ProductVariants;