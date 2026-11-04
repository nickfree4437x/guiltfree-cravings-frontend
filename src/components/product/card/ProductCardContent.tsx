
import type { Product, ProductVariant } from "../../../api/productApi";

import ProductCardPricing from "./ProductCardPricing";

// ─── Types ────────────────────────────────────────────────

type PackagingOption =
  | "Plastic Box"
  | "Glass Jar"
  | "Cardboard Box";

interface ProductCardContentProps {
  product: Product;
  packaging?: PackagingOption;

  onAddToCart: (variant: ProductVariant, quantity: number) => void;
  onVariantChange?: (variant: ProductVariant | null) => void;

  // Active offer details
  discountedVariantIds?: number[];
  discountPercentage?: number;
}

// ─── 2-line clamp style ───────────────────────────────────

const TITLE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
} as const;

// ─── Component ────────────────────────────────────────────

function ProductCardContent({
  product,
  packaging = "Plastic Box",
  onAddToCart,
  onVariantChange,
  discountedVariantIds = [],
  discountPercentage = 20,
}: ProductCardContentProps) {
  return (
    <div className="flex flex-1 flex-col p-3 sm:p-5 md:p-5">

      {/* Product Title */}

      <h3
        className="-mt-3 text-[12px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#1F4A2E] sm:text-[15px] md:text-[17px]"
        style={TITLE_CLAMP_STYLE}
      >
        {product.name}
      </h3>

      {/* Product Pricing */}

      <ProductCardPricing
        product={product}
        packaging={packaging}
        onAddToCart={onAddToCart}
        onVariantChange={onVariantChange}
        discountedVariantIds={discountedVariantIds}
        discountPercentage={discountPercentage}
      />

    </div>
  );
}

export default ProductCardContent;
