
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import type { Product, ProductVariant } from "../../api/productApi";
import { useCartStore } from "../../store/cartStore";

import ProductCardImage from "./card/ProductCardImage";
import ProductCardContent from "./card/ProductCardContent";

// ─── Types ────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
}

// ─── Component ────────────────────────────────────────────
function ProductCard({
  product,
  packaging = "Plastic Box",
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  // Cart actions
  const addToCart = useCartStore((s) => s.addToCart);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);

  // ─── Variant Selection ──────────────────────────────────
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

  // ─── Add to Cart ────────────────────────────────────────
  const handleAddToCart = (
    variant: ProductVariant,
    quantity: number
  ) => {
    if (quantity <= 0) return;

    // Allow guests and authenticated users to add products.
    addToCart(product, variant, quantity);

    // Open the cart drawer without showing the login modal.
    openCartDrawer();
  };

  // Variant-aware image
  const imageVariant =
    selectedVariant?.productId === product.id &&
    selectedVariant.packaging === packaging
      ? selectedVariant
      : null;

  // ─── Render ─────────────────────────────────────────────
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-[#C9788B]/20 bg-white">
      {/* Product Image */}
      <Link
        to={`/products/${product.id}`}
        state={{
          packaging,
          selectedVariantId: selectedVariant?.id ?? null,
          selectedVariantQuantity: selectedVariant?.quantity ?? null,
        }}
        aria-label={`View details for ${product.name}`}
        className="group/image relative block cursor-pointer overflow-hidden focus:outline-none"
      >
        <div className="relative z-10">
          <ProductCardImage
            product={product}
            packaging={packaging}
            variant={imageVariant}
          />
        </div>

        {/* Decorative fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 opacity-70"
        />

        {/* Hover overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[#B5697A]/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
        />
      </Link>

      {/* Product Content */}
      <div className="relative flex flex-1 flex-col bg-white">
        <ProductCardContent
          product={product}
          packaging={packaging}
          onAddToCart={handleAddToCart}
          onVariantChange={handleVariantChange}
        />
      </div>
    </article>
  );
}

export default ProductCard;