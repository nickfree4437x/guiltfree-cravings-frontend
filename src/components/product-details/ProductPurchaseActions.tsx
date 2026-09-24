import {
  ShoppingBag,
} from "lucide-react";

interface ProductPurchaseActionsProps {
  disabled?: boolean;
  onAddToCart: () => void;
}

function ProductPurchaseActions({
  disabled = false,
  onAddToCart,
}: ProductPurchaseActionsProps) {
  return (
    <button
      type="button"
      onClick={onAddToCart}
      disabled={disabled}
      className="
        mt-4
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#B5697A]
        px-5
        text-sm
        font-medium
        tracking-wide
        text-white
        transition-all
        duration-200
        hover:bg-[#A55F70]
        hover:shadow-md
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#B5697A]/40
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-[#B5697A]
        disabled:hover:shadow-none
      "
    >
      <ShoppingBag
        className="h-4 w-4"
        strokeWidth={2}
      />

      Add to Cart
    </button>
  );
}

export default ProductPurchaseActions;