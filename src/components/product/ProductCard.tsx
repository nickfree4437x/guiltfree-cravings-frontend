import { useState } from "react";
import { Link } from "react-router-dom";

import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

import OtpAuthModal from "../auth/OtpAuthModal";

import ProductCardImage from "./card/ProductCardImage";
import ProductCardContent from "./card/ProductCardContent";

interface ProductCardProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
}

function ProductCard({
  product,
  packaging = "Plastic Box",
}: ProductCardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const setPendingCartItem = useCartStore(
    (state) => state.setPendingCartItem
  );

  const addPendingCartItem = useCartStore(
    (state) => state.addPendingCartItem
  );

  /* =========================================================
     ADD TO CART
  ========================================================= */
  const handleAddToCart = (
    variant: ProductVariant,
    quantity: number
  ) => {
    if (quantity <= 0) return;

    if (isAuthenticated) {
      addToCart(product, variant, quantity);
      return;
    }

    setPendingCartItem(product, variant, quantity);
    setIsAuthModalOpen(true);
  };

  /* =========================================================
     AUTH SUCCESS
  ========================================================= */
  const handleAuthSuccess = () => {
    addPendingCartItem();
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <article
        className="
          group relative flex h-full flex-col
          rounded-md
          bg-white
          shadow-[0_8px_30px_-18px_rgba(82,55,43,0.22)]
        "
      >
        {/* =====================================================
            IMAGE AREA
        ===================================================== */}
        <Link
          to={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="
            group/image relative block cursor-pointer
            overflow-hidden
            rounded-sm
            bg-[#FBF7F2]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
          "
        >
          {/* Soft image-area glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              z-0
              h-40
              w-40
              rounded-full
              bg-[#F8E8EC]/70
              transition-transform
              duration-700
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-16
              z-0
              h-40
              w-40
              rounded-full
              bg-[#F5E9D9]/60
              blur-3xl
            "
          />

          {/* Product image */}
          <div className="relative z-10">
            <ProductCardImage
              product={product}
              packaging={packaging}
            />
          </div>

          {/* Subtle bottom fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-20
              h-20
              opacity-70
            "
          />

          {/* Hover image treatment */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-30
              bg-gradient-to-t
              from-[#B5697A]/[0.08]
              via-transparent
              to-transparent
              opacity-0
              transition-opacity
              duration-500
              group-hover/image:opacity-100
            "
          />
        </Link>

        {/* =====================================================
            PRODUCT CONTENT
        ===================================================== */}
        <div className="relative flex flex-1 flex-col bg-white">
          <ProductCardContent
            product={product}
            packaging={packaging}
            onAddToCart={handleAddToCart}
          />
        </div>
      </article>

      {/* =====================================================
          AUTH MODAL
      ===================================================== */}
      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default ProductCard;