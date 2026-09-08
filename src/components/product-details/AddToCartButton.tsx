import { Link } from "react-router-dom";

import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant:
    | ProductVariant
    | null;
  hasVariants: boolean;
  addedToCart: boolean;
  quantity: number;
  formatQuantity: (
    variant: ProductVariant
  ) => string;
  onAddToCart: () => void;
}

function AddToCartButton({
  product,
  selectedVariant,
  hasVariants,
  addedToCart,
  quantity,
  formatQuantity,
  onAddToCart,
}: AddToCartButtonProps) {
  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={
          !hasVariants ||
          !selectedVariant
        }
        className={`flex min-h-10 md:min-h-11 w-full items-center justify-center rounded-full px-7 py-2 md:py-2.5 text-[13px] md:text-[14px] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          !hasVariants ||
          !selectedVariant
            ? "cursor-not-allowed bg-slate-300 text-white"
            : addedToCart
              ? "bg-green-700 text-white hover:bg-green-800 focus:ring-green-700"
              : "bg-[#8b542f] text-white shadow-[0_8px_20px_rgba(139,84,47,0.18)] hover:bg-[#744324] focus:ring-[#8b542f]"
        }`}
      >
        {!hasVariants ||
        !selectedVariant
          ? "Currently Unavailable"
          : addedToCart
            ? "Added to Cart"
            : "Add to Cart"}
      </button>

      {addedToCart &&
        selectedVariant && (
          <div
            className="mt-2 flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 sm:flex-row items-center sm:justify-between"
            role="status"
            aria-live="polite"
          >
            <p className="text-[12px] md:text-[14px] font-[350] text-green-800">
              {quantity} ×{" "}
              {product.name} (
              {formatQuantity(
                selectedVariant
              )}
              ) added to your cart.
            </p>

            <Link
              to="/cart"
              className="shrink-0 text-[12px] md:text-[14px] font-[350] text-[#8b542f] hover:underline transition hover:text-[#744324]"
            >
              View Cart
            </Link>
          </div>
        )}
    </div>
  );
}

export default AddToCartButton;