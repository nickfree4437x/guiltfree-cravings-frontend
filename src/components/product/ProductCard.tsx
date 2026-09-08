import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "../../api/productApi";
import { useWishlistStore } from "../../store/wishlistStore";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const regularVariants = product.variants.filter(
    (variant) => variant.packaging === "Regular"
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const isInWishlist = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id)
  );

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  return (
    <article className="group overflow-hidden rounded-md border border-[#eadfd3] bg-white transition duration-300">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}
      <div className="relative flex h-60 items-center justify-center overflow-hidden bg-white p-5 sm:h-[290px] sm:p-6">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain object-center transition-transform duration-500 ease-out"
        />

        {/* =========================
            WISHLIST BUTTON
        ========================= */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={
            isInWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          title={
            isInWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 backdrop-blur-sm focus:outline-none ${
            isInWishlist
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-[#eadfd3] text-slate-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart
            className={`h-[18px] w-[18px] transition-all duration-200 ${
              isInWishlist
                ? ""
                : ""
            }`}
            fill={isInWishlist ? "currentColor" : "none"}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>

      </div>

      {/* =========================
          PRODUCT CONTENT
      ========================= */}
      <div className="p-5 sm:p-6">

        {/* Product Name */}
        <h3 className="text-[16px] font-semibold tracking-tight text-slate-900 md:text-[20px] sm:text-2xl">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="mt-1 line-clamp-2 text-[12px] font-[350] leading-5 text-slate-600 md:text-[14.5px]">
          {product.description}
        </p>

        {/* =========================
            PRICING + CTA
        ========================= */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#eee4dc] pt-4">

          {/* Pricing */}
          <div className="flex items-center gap-3">

            {regularVariants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex items-center gap-3"
              >

                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {variant.quantity}
                    {variant.unit}
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-slate-900 md:text-[14.5px]">
                    ₹{variant.price}
                  </p>
                </div>

                {index < regularVariants.length - 1 && (
                  <div className="h-7 w-px bg-[#e3d7cd]" />
                )}

              </div>
            ))}

          </div>

          {/* View Product */}
          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            className="shrink-0 rounded-full bg-[#8b542f] px-4 py-2 text-[12px] font-[350] text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 md:text-[13px] sm:px-5"
          >
            View Product
          </Link>

        </div>

      </div>
    </article>
  );
}

export default ProductCard;