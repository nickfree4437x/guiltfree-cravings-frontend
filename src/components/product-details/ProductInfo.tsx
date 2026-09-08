import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import ProductHighlights from "./ProductHighlights";
import ProductVariants from "./ProductVariants";
import QuantitySelector from "./QuantitySelector";
import ProductSummary from "./ProductSummary";
import ProductPickerGuide from "./ProductPickerGuide";
import AddToCartButton from "./AddToCartButton";

interface ProductInfoProps {
  product: Product;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  quantity: number;
  hasVariants: boolean;
  addedToCart: boolean;
  formatQuantity: (
    variant: ProductVariant
  ) => string;
  onVariantChange: (
    variant: ProductVariant
  ) => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

function ProductInfo({
  product,
  variants,
  selectedVariant,
  quantity,
  hasVariants,
  addedToCart,
  formatQuantity,
  onVariantChange,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}: ProductInfoProps) {
  return (
    <div className="min-w-0 lg:pt-2">

      {/* Product name */}
      <h1 className="max-w-2xl text-[16px] sm:text-[20px] md:text-[26px] font-bold leading-[1.08] tracking-tight text-[#2c2c2c]">
        {product.name}
      </h1>

      {/* Price */}
      {selectedVariant && (
        <div className="mt-2 flex items-end gap-3">
          <p className="text-[18px] sm:text-[24px] font-bold tracking-tight text-[#8b542f]">
            ₹{selectedVariant.price}
          </p>

          <p className="pb-1 text-xs font-[350] text-slate-400">
            {formatQuantity(
              selectedVariant
            )}{" "}
            ·{" "}
            <span className="capitalize">
              {selectedVariant.packaging}
            </span>
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="my-4 h-px bg-[#eadfd3]" />

      {/* Description */}
      <p className="max-w-2xl text-[12px] sm:text-[14px]  font-[350] leading-5 text-slate-600 sm:leading-6 text-justify">
        {product.description}
      </p>

      {/* Highlights */}
      <ProductHighlights />

      {/* Variants */}
      {hasVariants ? (
        <ProductVariants
          variants={variants}
          selectedVariant={
            selectedVariant
          }
          formatQuantity={
            formatQuantity
          }
          onVariantChange={
            onVariantChange
          }
        />
      ) : (
        <div className="mt-8 border-y border-[#eadfd3] py-5">
          <p className="text-sm  text-[#2c2c2c]">
            Product currently unavailable
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            This product does not have
            any available purchase
            variants right now.
          </p>
        </div>
      )}

      {/* Quantity */}
      {hasVariants &&
        selectedVariant && (
          <QuantitySelector
            productName={
              product.name
            }
            quantity={quantity}
            onIncrease={
              onIncreaseQuantity
            }
            onDecrease={
              onDecreaseQuantity
            }
          />
        )}

      {/* Summary */}
      {hasVariants &&
        selectedVariant && (
          <ProductSummary
            selectedVariant={
              selectedVariant
            }
            quantity={quantity}
            formatQuantity={
              formatQuantity
            }
          />
        )}

      {/* Guide */}
      {hasVariants &&
        selectedVariant && (
          <ProductPickerGuide />
        )}

      {/* CTA */}
      <AddToCartButton
        product={product}
        selectedVariant={
          selectedVariant
        }
        hasVariants={
          hasVariants
        }
        addedToCart={
          addedToCart
        }
        quantity={quantity}
        formatQuantity={
          formatQuantity
        }
        onAddToCart={
          onAddToCart
        }
      />
    </div>
  );
}

export default ProductInfo;