import type {
  Product,
  ProductVariant,
} from "../../../api/productApi";

import ProductCardPricing from "./ProductCardPricing";

interface ProductCardContentProps {
  product: Product;
  packaging?: "Regular" | "Glass Jar";
  onAddToCart: (
    variant: ProductVariant,
    quantity: number
  ) => void;
}

function ProductCardContent({
  product,
  packaging = "Regular",
  onAddToCart,
}: ProductCardContentProps) {
  return (
    <div className="flex flex-1 flex-col p-3 sm:p-5 md:p-6">

      {/* TITLE */}
      <h3
        className="
          text-[12px]
          font-semibold
          leading-[1.25]
          tracking-[-0.01em]
          text-[#1F4A2E]
          transition-colors duration-300
          group-hover:text-[#B5697A]
          sm:text-[15px]
          md:text-[18px]
        "
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.name}
      </h3>

      {/* DESCRIPTION — mobile pe hidden, md+ (desktop) pe visible */}
      {/* inline `display` hataya — warna `hidden` override ho jata hai */}
      <p
        className="
          hidden md:block
          mt-1
          text-[12.5px]
          leading-[1.65]
          text-[#7A6A5C]
          md:text-[13px]
        "
        style={{
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "42px",
          maxHeight: "42px",
        }}
      >
        {product.description}
      </p>

      {/* PRICING */}
      <ProductCardPricing
        product={product}
        packaging={packaging}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}

export default ProductCardContent;