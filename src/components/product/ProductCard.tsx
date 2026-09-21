import { useState } from "react";

import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

import OtpAuthModal from "../auth/OtpAuthModal";

import ProductQuickViewModal from "./ProductQuickViewModal";
import ProductCardImage from "./card/ProductCardImage";
import ProductCardContent from "./card/ProductCardContent";

interface ProductCardProps {
  product: Product;
  packaging?: "Regular" | "Glass Jar";
}

function ProductCard({
  product,
  packaging = "Regular",
}: ProductCardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const [isQuickViewOpen, setIsQuickViewOpen] =
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

  /* =========================================================
     QUICK VIEW
  ========================================================= */
  const handleQuickViewOpen = () => {
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
  };

  return (
    <>
      <article
        className="
          group relative flex h-full flex-col
          rounded-lg
          border border-[#EFE3D2]
          bg-white
          shadow-[0_2px_12px_-4px_rgba(139,111,92,0.06)]
          transition-all duration-500 ease-out
        "
      >
        {/* ================= IMAGE (clickable → Quick View) ================= */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleQuickViewOpen}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              handleQuickViewOpen();
            }
          }}
          aria-label={`View details for ${product.name}`}
          className="
            group/image relative cursor-pointer
            overflow-hidden rounded-t-xl
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-[#B5697A]
          "
        >
          <ProductCardImage
            product={product}
            packaging={packaging}
          />

          {/* Hover overlay */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/25 via-transparent to-transparent
              opacity-0 transition-opacity duration-500
              group-hover/image:opacity-100
            "
          />
        </div>

        {/* ================= CONTENT ================= */}
        <ProductCardContent
          product={product}
          packaging={packaging}
          onAddToCart={handleAddToCart}
        />
      </article>

      {/* ================= MODALS ================= */}
      {isQuickViewOpen && (
        <ProductQuickViewModal
          product={product}
          packaging={packaging}
          onClose={handleQuickViewClose}
        />
      )}

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