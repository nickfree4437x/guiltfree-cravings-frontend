import {
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

interface ProductPurchaseActionsProps {
  disabled?: boolean;
  onAddToCart: () => void;
  onViewCart: () => void;
}

function ProductPurchaseActions({
  disabled = false,
  onAddToCart,
  onViewCart,
}: ProductPurchaseActionsProps) {
  return (
    <div className="mt-4 space-y-2">
      {/* =====================================================
          ADD TO CART
      ===================================================== */}

      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        className="
          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#B5697A]
          px-5
          text-[10px]
          tracking-wide
          text-white
          transition-all
          duration-200
          hover:bg-[#A55F70]
          hover:shadow-sm
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B5697A]/40
          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:bg-[#B5697A]
          disabled:hover:shadow-none
          md:text-[12px]
        "
      >
        <ShoppingBag
          className="h-4 w-4"
          strokeWidth={2}
        />

        Add to Cart
      </button>

      {/* =====================================================
          VIEW CART
      ===================================================== */}

      <button
        type="button"
        onClick={onViewCart}
        className="
          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#B5697A]/30
          bg-white
          px-5
          text-[10px]
          tracking-wide
          text-[#B5697A]
          transition-all
          duration-200
          hover:border-[#B5697A]/50
          hover:bg-[#B5697A]/5
          hover:shadow-sm
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#B5697A]/30
          md:text-[12px]
        "
      >
        <ShoppingCart
          className="h-4 w-4"
          strokeWidth={2}
        />

        View Cart
      </button>
    </div>
  );
}

export default ProductPurchaseActions;