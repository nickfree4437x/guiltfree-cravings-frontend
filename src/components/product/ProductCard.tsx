
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

type PackagingType = NonNullable<ProductCardProps["packaging"]>;

// ─── Helpers ──────────────────────────────────────────────

const getInitialVariant = (
  product: Product,
  packaging: PackagingType
): ProductVariant | null => {
  return (
    product.variants?.find(
      (variant) => variant.packaging === packaging
    ) ?? null
  );
};

const isValidPackagingVariant = (
  variant: ProductVariant | null,
  packaging: PackagingType
): variant is ProductVariant => {
  return (
    variant !== null &&
    variant.packaging === packaging
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

  // --------------------------------------------------
  // SYNCHRONIZE SELECTED VARIANT
  // --------------------------------------------------

  useEffect(() => {
    setSelectedVariant(
      getInitialVariant(product, packaging)
    );
  }, [product, packaging]);

  // --------------------------------------------------
  // CART ACTIONS
  // --------------------------------------------------

  const addToCart = useCartStore((s) => s.addToCart);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);

  // --------------------------------------------------
  // OFFER VALIDATION
  // --------------------------------------------------

  const eligibleVariantIds = new Set(
    discountedVariantIds.map(Number)
  );

  const hasValidDiscount =
    Number.isFinite(discountPercentage) &&
    discountPercentage > 0 &&
    discountPercentage <= 100;

  const showDiscountBadge =
    isValidPackagingVariant(selectedVariant, packaging) &&
    eligibleVariantIds.has(Number(selectedVariant.id)) &&
    hasValidDiscount;

  // --------------------------------------------------
  // VARIANT SELECTION
  // --------------------------------------------------

  const handleVariantChange = useCallback(
    (variant: ProductVariant | null) => {
      setSelectedVariant((current) => {
        // Prevent a variant from another packaging
        // from becoming the selected card variant.

        if (
          variant &&
          variant.packaging !== packaging
        ) {
          return current;
        }

        // Avoid unnecessary state updates.

        if (
          current?.id === variant?.id &&
          current?.productId === variant?.productId
        ) {
          return current;
        }

        return variant;
      });
    },
    [packaging]
  );

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAddToCart = (
    variant: ProductVariant,
    quantity: number
  ) => {
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      variant.packaging !== packaging
    ) {
      return;
    }

    // Original variant price remains unchanged.
    // Discount calculation stays separate.

    addToCart(product, variant, quantity);

    openCartDrawer();
  };

  // --------------------------------------------------
  // VARIANT-AWARE IMAGE
  // --------------------------------------------------

  // Selected variant gets priority.
  // If no valid selection exists, use the first
  // available variant for the current packaging.

  const imageVariant = isValidPackagingVariant(
    selectedVariant,
    packaging
  )
    ? selectedVariant
    : getInitialVariant(product, packaging);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-[#C9788B]/20 bg-white">

      {/* PRODUCT IMAGE */}

      <Link
        to={`/products/${product.id}`}
        state={{
          packaging,
          selectedVariantId: imageVariant?.id ?? null,
          selectedVariantQuantity: imageVariant?.quantity ?? null,
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

        {/* DISCOUNT BADGE */}

        {showDiscountBadge && (
          <span className="absolute right-2.5 top-2.5 z-40 inline-flex items-center rounded-full bg-[#FCECEF] px-2.5 py-0.5 text-[8px] tracking-wide text-[#B5697A] sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[9px]">
            {discountPercentage}% OFF
          </span>
        )}

        {/* DECORATIVE FADE */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 opacity-70"
        />

        {/* HOVER OVERLAY */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[#B5697A]/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
        />
      </Link>

      {/* PRODUCT CONTENT */}

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
