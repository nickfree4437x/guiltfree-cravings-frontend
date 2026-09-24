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
          rounded-lg
          border border-[#EFE3D2]
          bg-white
          shadow-[0_2px_12px_-4px_rgba(139,111,92,0.06)]
          transition-all duration-500 ease-out
        "
      >
        {/* ================= IMAGE → PRODUCT DETAILS ================= */}
        <Link
          to={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="
            group/image relative block cursor-pointer
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
              bg-gradient-to-t
              from-black/25
              via-transparent
              to-transparent
              opacity-0
              transition-opacity duration-500
              group-hover/image:opacity-100
            "
          />
        </Link>

        {/* ================= CONTENT ================= */}
        <ProductCardContent
          product={product}
          packaging={packaging}
          onAddToCart={handleAddToCart}
        />
      </article>

      {/* ================= AUTH MODAL ================= */}
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