
import { useCallback, useState } from "react";
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

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

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

  const openCartDrawer = useCartStore(
    (state) => state.openCartDrawer
  );

  /*
   * =========================================================
   * SELECTED VARIANT
   * =========================================================
   */

  const handleVariantChange = useCallback(
    (variant: ProductVariant | null) => {
      setSelectedVariant((current) => {
        if (
          current?.id === variant?.id &&
          current?.productId === variant?.productId
        ) {
          return current;
        }

        return variant;
      });
    },
    []
  );

  /*
   * =========================================================
   * ADD TO CART
   * =========================================================
   */

  const handleAddToCart = (
    variant: ProductVariant,
    quantity: number
  ) => {
    if (quantity <= 0) {
      return;
    }

    if (isAuthenticated) {
      addToCart(product, variant, quantity);
      openCartDrawer();
      return;
    }

    setPendingCartItem(product, variant, quantity);
    setIsAuthModalOpen(true);
  };

  /*
   * =========================================================
   * AUTH SUCCESS
   * =========================================================
   */

  const handleAuthSuccess = () => {
    addPendingCartItem();
    setIsAuthModalOpen(false);
    openCartDrawer();
  };

  /*
   * =========================================================
   * IMAGE VARIANT
   * =========================================================
   */

  const imageVariant =
    selectedVariant?.productId === product.id &&
    selectedVariant.packaging === packaging
      ? selectedVariant
      : null;

  return (
    <>
      <article
        className="
          group relative flex h-full flex-col
          rounded-lg
          border border-[#C9788B]/20
          bg-white
        "
      >
        {/* IMAGE AREA */}
        <Link 
          to={`/products/${product.id}`}
          state={{
            packaging,
            selectedVariantId: selectedVariant?.id ?? null,
            selectedVariantQuantity: selectedVariant?.quantity ?? null,
          }}
          aria-label={`View details for ${product.name}`}
          className="
            group/image relative block cursor-pointer
            overflow-hidden rounded-xl bg-[#FBF7F2]
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
              absolute -right-16 -top-16 z-0
              h-40 w-40 rounded-full
              bg-[#F8E8EC]/70
              transition-transform duration-700
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-20 -left-16 z-0
              h-40 w-40 rounded-full
              bg-[#F5E9D9]/60 blur-3xl
            "
          />

          {/* Variant-aware product image */}
          <div className="relative z-10">
            <ProductCardImage
              product={product}
              packaging={packaging}
              variant={imageVariant}
            />
          </div>

          {/* Subtle bottom fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-x-0 bottom-0 z-20
              h-20 opacity-70
            "
          />

          {/* Hover image treatment */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0 z-30
              bg-gradient-to-t
              from-[#B5697A]/[0.08]
              via-transparent to-transparent
              opacity-0 transition-opacity duration-500
              group-hover/image:opacity-100
            "
          />
        </Link>

        {/* PRODUCT CONTENT */}
        <div className="relative flex flex-1 flex-col bg-white">
          <ProductCardContent
            product={product}
            packaging={packaging}
            onAddToCart={handleAddToCart}
            onVariantChange={handleVariantChange}
          />
        </div>
      </article>

      {/* AUTH MODAL */}
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
