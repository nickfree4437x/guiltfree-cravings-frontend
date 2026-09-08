import type {
  ProductVariant,
} from "../../api/productApi";

interface ProductSummaryProps {
  selectedVariant: ProductVariant;
  quantity: number;
  formatQuantity: (
    variant: ProductVariant
  ) => string;
}

function ProductSummary({
  selectedVariant,
  quantity,
  formatQuantity,
}: ProductSummaryProps) {
  const total =
    selectedVariant.price *
    quantity;

  return (
    <div className="mt-4 border-b border-[#eadfd3] pb-6">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Your selection
          </p>

          <p className="mt-1.5 truncate text-[14px] md:text-[15px] font-semibold text-slate-900">
            {formatQuantity(
              selectedVariant
            )}{" "}
            <span className="font-normal text-slate-400">
              ·
            </span>{" "}
            <span className="capitalize">
              {selectedVariant.packaging}
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {quantity}{" "}
            {quantity === 1
              ? "pack"
              : "packs"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Total
          </p>

          <p className="mt-1 text-[16px] md:text-[18px] font-bold tracking-tight text-[#8b542f]">
            ₹{total}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductSummary;