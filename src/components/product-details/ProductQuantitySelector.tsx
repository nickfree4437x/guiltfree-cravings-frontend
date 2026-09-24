import {
  Minus,
  Plus,
} from "lucide-react";

interface ProductQuantitySelectorProps {
  quantity: number;
  onChange: (
    quantity: number
  ) => void;
}

function ProductQuantitySelector({
  quantity,
  onChange,
}: ProductQuantitySelectorProps) {
  return (
    <div>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8B7A6C]">
        Quantity
      </h2>

      <div
        className="
          mt-3
          inline-flex
          h-11
          items-center
          overflow-hidden
          rounded-xl
          border
          border-[#EFE3D2]
          bg-white
        "
      >
        <button
          type="button"
          onClick={() =>
            onChange(
              Math.max(1, quantity - 1)
            )
          }
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="
            flex h-full w-11
            items-center justify-center
            text-[#8B7A6C]
            transition-colors
            hover:bg-[#FBEEF1]
            hover:text-[#B5697A]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <Minus
            className="h-4 w-4"
            strokeWidth={2.2}
          />
        </button>

        <span
          className="
            flex h-full
            min-w-[44px]
            items-center justify-center
            border-x
            border-[#EFE3D2]
            text-sm
            font-semibold
            text-[#1F4A2E]
          "
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            onChange(quantity + 1)
          }
          aria-label="Increase quantity"
          className="
            flex h-full w-11
            items-center justify-center
            text-[#8B7A6C]
            transition-colors
            hover:bg-[#FBEEF1]
            hover:text-[#B5697A]
          "
        >
          <Plus
            className="h-4 w-4"
            strokeWidth={2.2}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductQuantitySelector;