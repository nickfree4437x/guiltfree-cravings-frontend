import { Leaf, Droplets, ShieldCheck, House } from "lucide-react";

import type { Product, ProductVariant } from "../../api/productApi";

import PackagingSelector from "./PackagingSelector";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductPurchaseActions from "./ProductPurchaseActions";

// ─── Types ────────────────────────────────────────────────
interface ProductDetailsInfoProps {
  product: Product;
  availablePackagings: string[];
  selectedPackaging: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  quantity: number;
  onPackagingChange: (packaging: string) => void;
  onVariantChange: (variant: ProductVariant) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onViewCart: () => void;
}

// ─── Config ───────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Leaf, label: "No Refined Sugar" },
  { icon: Droplets, label: "No Palm Oil" },
  { icon: ShieldCheck, label: "No Preservatives" },
  { icon: House, label: "Made at Home" },
];

const PACKAGING_LABELS: Record<string, string> = {
  "Plastic Box": "Regular",
  "Cardboard Box": "Cardboard Boxes",
  "Glass Jar": "Glass Jars",
};

const getPackagingLabel = (packaging: string) =>
  PACKAGING_LABELS[packaging] ?? packaging;

// ─── Component ────────────────────────────────────────────
function ProductDetailsInfo({
  product,
  availablePackagings,
  selectedPackaging,
  variants,
  selectedVariant,
  quantity,
  onPackagingChange,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onViewCart,
}: ProductDetailsInfoProps) {
  return (
    <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
      {/* Product name */}
      <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-semibold md:-mt-4 -mt-5 tracking-wide text-[#C9788B] leading-snug md:whitespace-nowrap">
        {product.name}
      </h1>

      {/* Description */}
      <p className="mt-1 text-[12px] sm:text-[13.5px] md:text-[13.5px] leading-relaxed font-light tracking-wide text-justify text-gray-500">
        {product.description}
      </p>

      {/* Trust badges */}
      <div className="mt-2 grid grid-cols-2 gap-5 pt-6 sm:grid-cols-4">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
              <Icon size={19} strokeWidth={1.7} />
            </div>
            <p className="mt-3 text-[11px] font-semibold leading-4 text-gray-600 sm:text-xs">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Packaging */}
      <PackagingSelector
        packagings={availablePackagings}
        selectedPackaging={selectedPackaging}
        onChange={onPackagingChange}
      />

      {/* Sizes */}
      <ProductVariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onChange={onVariantChange}
      />

      {/* Purchase */}
      <div className="mt-7">
        <div className="flex items-end justify-between gap-4">
          {/* Quantity */}
          <ProductQuantitySelector quantity={quantity} onChange={onQuantityChange} />

          {/* Price */}
          {selectedVariant && (
            <div className="pb-1">
              <div className="flex items-end justify-end gap-2">
                <span className="text-[14px] font-semibold text-gray-600 md:text-[17px]">
                  ₹{selectedVariant.price * quantity}
                </span>
                <span className="pb-0.5 text-xs text-[#8B7A6C]">
                  {selectedVariant.quantity}
                  {selectedVariant.unit} · {getPackagingLabel(selectedPackaging)}
                </span>
              </div>
            </div>
          )}
        </div>

        <ProductPurchaseActions
          disabled={!selectedVariant}
          onAddToCart={onAddToCart}
          onViewCart={onViewCart}
        />
      </div>
    </div>
  );
}

export default ProductDetailsInfo;