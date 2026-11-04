
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Product, ProductVariant } from "../../api/productApi";
import { useCartStore } from "../../store/cartStore";

import ProductCardImage from "./card/ProductCardImage";
import ProductCardContent from "./card/ProductCardContent";

// ─── Types ────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
  discountedVariantIds?: number[];
  discountPercentage?: number;
}

// ─── Helpers ──────────────────────────────────────────────

const getInitialVariant = (
  product: Product,
  packaging: ProductCardProps["packaging"]
): ProductVariant | null => {
  return (
    product.variants?.find(
      (variant) => variant.packaging === packaging
    ) ?? null
  );
};

// ─── Component ────────────────────────────────────────────

function ProductCard({
  product,
  packaging = "Plastic Box",
  discountedVariantIds = [],
  discountPercentage = 20,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(() =>
      getInitialVariant(product, packaging)
    );

  // Keep selected variant synchronized with product and packaging.
  useEffect(() => {
    setSelectedVariant(getInitialVariant(product, packaging));
  }, [product, packaging]);

  // Cart actions
  const addToCart = useCartStore((s) => s.addToCart);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);

  // ─── Offer Validation ───────────────────────────────────

  const eligibleVariantIds = new Set(
    discountedVariantIds.map(Number)
  );

  const hasValidDiscount =
    Number.isFinite(discountPercentage) &&
    discountPercentage > 0 &&
    discountPercentage <= 100;

  const showDiscountBadge =
    selectedVariant !== null &&
    selectedVariant.packaging === packaging &&
    eligibleVariantIds.has(Number(selectedVariant.id)) &&
    hasValidDiscount;

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

    // Keep original variant price in cart.
    // Discount calculation remains separate.
    addToCart(product, variant, quantity);

    openCartDrawer();
  };

  // ─── Variant-aware Image ────────────────────────────────

  // Use the selected variant image for Glass Jar packaging.
  // ProductId is intentionally not required because some API
  // responses do not include productId inside variant objects.

  const imageVariant =
    selectedVariant &&
    selectedVariant.packaging === packaging
      ? selectedVariant
      : getInitialVariant(product, packaging);

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

        {/* Discount Badge - Top Right */}

        {showDiscountBadge && (
          <span className="absolute right-2.5 top-2.5 z-40 inline-flex items-center rounded-full bg-[#FCECEF] px-2.5 py-0.5 text-[8px] tracking-wide text-[#B5697A] sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[9px]">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Decorative Fade */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 opacity-70"
        />

        {/* Hover Overlay */}

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
          discountedVariantIds={discountedVariantIds}
          discountPercentage={discountPercentage}
        />
      </div>

    </article>
  );
}

export default ProductCard;
