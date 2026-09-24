import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import PackagingSelector from "./PackagingSelector";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductPurchaseActions from "./ProductPurchaseActions";
import ProductPickerGuide from "./ProductPickerGuide";

interface ProductDetailsInfoProps {
  product: Product;
  availablePackagings: string[];
  selectedPackaging: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  quantity: number;
  onPackagingChange: (
    packaging: string
  ) => void;
  onVariantChange: (
    variant: ProductVariant
  ) => void;
  onQuantityChange: (
    quantity: number
  ) => void;
  onAddToCart: () => void;
}

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
}: ProductDetailsInfoProps) {
  return (
    <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
      {/* Product name */}
      <div>
        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[#B5697A]
          "
        >
          GuiltFree Cravings
        </p>

        <h1
          className="
            mt-2
            text-2xl
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-[#1F4A2E]
            sm:text-3xl
            lg:text-[34px]
          "
        >
          {product.name}
        </h1>
      </div>

      {/* Description */}
      <div className="mt-5">
        <p
          className="
            text-sm
            leading-7
            text-[#5F554E]
            sm:text-[15px]
          "
        >
          {product.description}
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-[#EFE3D2]" />

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

      {/* Price */}
      {selectedVariant && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B7A6C]">
            Price
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-semibold text-[#1F4A2E]">
              ₹{selectedVariant.price}
            </span>

            <span className="pb-0.5 text-xs text-[#8B7A6C]">
              {selectedVariant.quantity}
              {selectedVariant.unit} ·{" "}
              {selectedVariant.packaging}
            </span>
          </div>
        </div>
      )}

      {/* Purchase */}
      <div className="mt-7">
        <ProductQuantitySelector
          quantity={quantity}
          onChange={onQuantityChange}
        />

        <ProductPurchaseActions
          disabled={!selectedVariant}
          onAddToCart={onAddToCart}
        />

        {/* Product Picker Guide */}
        <ProductPickerGuide />
      </div>

      {/* Trust information */}
      <div
        className="
          mt-8
          grid grid-cols-1
          gap-3
          border-t border-[#EFE3D2]
          pt-6
          sm:grid-cols-3
        "
      >
        <div>
          <p className="text-xs font-medium text-[#1F4A2E]">
            No Refined Sugar
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#8B7A6C]">
            Made with jaggery or dates.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-[#1F4A2E]">
            No Palm Oil
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#8B7A6C]">
            Desi ghee is our only fat.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-[#1F4A2E]">
            No Preservatives
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#8B7A6C]">
            Made fresh in small batches.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsInfo;