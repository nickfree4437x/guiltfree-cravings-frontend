import { useEffect, useRef, useState } from "react";
import {
  Check,
  ShoppingBag,
  ShoppingCart,
  LoaderCircle,
} from "lucide-react";

interface ProductPurchaseActionsProps {
  disabled?: boolean;
  onAddToCart: () => void | Promise<void>;
  onViewCart: () => void;
}

function ProductPurchaseActions({
  disabled = false,
  onAddToCart,
  onViewCart,
}: ProductPurchaseActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    setIsAdded(false);

    try {
      await onAddToCart();

      setIsAdded(true);
      setShowToast(true);

      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (addedTimer.current) clearTimeout(addedTimer.current);

      toastTimer.current = setTimeout(() => {
        setShowToast(false);
      }, 2500);

      addedTimer.current = setTimeout(() => {
        setIsAdded(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative mt-4 space-y-2">
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="
            absolute bottom-full left-0 z-20 mb-3 flex w-full
            items-center gap-2 rounded-xl border border-emerald-200
            bg-white px-4 py-3 text-[11px] md:text-[12px] text-emerald-700
            shadow-lg
          "
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-4 w-4" />
          </span>
          Added to your cart successfully!
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        aria-live="polite"
        className={`
          flex h-10 w-full items-center justify-center gap-2
          rounded-xl px-5 text-[10px] tracking-wide text-white
          transition-all duration-200 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-[#B5697A]/40
          disabled:cursor-not-allowed disabled:opacity-60
          md:text-[12px]
          ${
            isAdded
              ? "bg-emerald-600"
              : "bg-[#B5697A] hover:bg-[#A55F70] hover:shadow-sm"
          }
        `}
      >
        {isAdding ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : isAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" strokeWidth={2} />
            Add to Cart
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onViewCart}
        className="
          flex h-10 w-full items-center justify-center gap-2
          rounded-xl border border-[#B5697A]/30 bg-white px-5
          text-[10px] tracking-wide text-[#B5697A] hover:border-[#B5697A]/50
          hover:bg-[#B5697A]/5 hover:shadow-sm
          focus:outline-none md:text-[12px]
        "
      >
        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
        View Cart
      </button>
    </div>
  );
}

export default ProductPurchaseActions;