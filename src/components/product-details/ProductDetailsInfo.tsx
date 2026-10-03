import {
  Leaf,
  Droplets,
  ShieldCheck,
  House,
} from "lucide-react";

import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import PackagingSelector from "./PackagingSelector";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductPurchaseActions from "./ProductPurchaseActions";

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

  /* =========================================================
     VIEW CART
     ========================================================= */

  onViewCart: () => void;
}

const getPackagingLabel = (
  packaging: string
) => {
  switch (packaging) {
    case "Plastic Box":
      return "Regular";

    case "Cardboard Box":
      return "Cardboard Boxes";

    case "Glass Jar":
      return "Glass Jars";

    default:
      return packaging;
  }
};

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
      <div>
        <h1
          className="
            text-[20px] sm:text-[24px] md:text-[28px]
            font-semibold md:-mt-4 -mt-7
            tracking-wide
            text-[#C9788B]
            leading-snug
            md:whitespace-nowrap
          "
        >
          {product.name}
        </h1>
      </div>

      {/* Description */}
      <div className="mt-1">
        <p
          className="
            text-[12.5px] sm:text-[13.5px] md:text-[14px]
            leading-relaxed
            tracking-wide
            text-justify
            text-gray-700
          "
        >
          {product.description}
        </p>
      </div>

      {/* Trust information */}
      <div
        className="
          mt-2
          grid grid-cols-2
          gap-5
          pt-6
          sm:grid-cols-4
        "
      >
        {/* No Refined Sugar */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-[#FBEEF1]
              text-[#B5697A]
            "
          >
            <Leaf
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              leading-4
              text-[#1F4A2E]
              sm:text-xs
            "
          >
            No Refined Sugar
          </p>
        </div>

        {/* No Palm Oil */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-[#FBEEF1]
              text-[#B5697A]
            "
          >
            <Droplets
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              leading-4
              text-[#1F4A2E]
              sm:text-xs
            "
          >
            No Palm Oil
          </p>
        </div>

        {/* No Preservatives */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-[#FBEEF1]
              text-[#B5697A]
            "
          >
            <ShieldCheck
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              leading-4
              text-[#1F4A2E]
              sm:text-xs
            "
          >
            No Preservatives
          </p>
        </div>

        {/* Made at Home */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-[#FBEEF1]
              text-[#B5697A]
            "
          >
            <House
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              leading-4
              text-[#1F4A2E]
              sm:text-xs
            "
          >
            Made at Home
          </p>
        </div>
      </div>

      {/* Packaging */}
      <PackagingSelector
        packagings={
          availablePackagings
        }
        selectedPackaging={
          selectedPackaging
        }
        onChange={
          onPackagingChange
        }
      />

      {/* Sizes */}
      <ProductVariantSelector
        variants={variants}
        selectedVariant={
          selectedVariant
        }
        onChange={
          onVariantChange
        }
      />

      {/* Purchase */}
      <div className="mt-7">
        {/* Quantity + Price */}
        <div className="flex items-end justify-between gap-4">
          {/* Quantity */}
          <div>
            <ProductQuantitySelector
              quantity={quantity}
              onChange={
                onQuantityChange
              }
            />
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className="pb-1">
              <div className="flex items-end justify-end gap-2">
                <span
                  className="
                    text-[14px]
                    font-semibold
                    text-[#1F4A2E]
                    md:text-[17px]
                  "
                >
                  ₹
                  {selectedVariant.price *
                    quantity}
                </span>

                <span
                  className="
                    pb-0.5
                    text-xs
                    text-[#8B7A6C]
                  "
                >
                  {
                    selectedVariant.quantity
                  }
                  {
                    selectedVariant.unit
                  }{" "}
                  ·{" "}
                  {getPackagingLabel(
                    selectedPackaging
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Actions */}
        <ProductPurchaseActions
          disabled={!selectedVariant}
          onAddToCart={
            onAddToCart
          }
          onViewCart={
            onViewCart
          }
        />
      </div>
    </div>
  );
}

export default ProductDetailsInfo;