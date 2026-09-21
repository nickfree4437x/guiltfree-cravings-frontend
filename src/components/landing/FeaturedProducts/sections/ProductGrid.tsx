import ProductCard from "../../../product/ProductCard";

import type { Product } from "../../../../api/productApi";

interface ProductGridProps {
  products: Product[];
  packaging: "Regular" | "Glass Jar";
}

function ProductGrid({
  products,
  packaging,
}: ProductGridProps) {
  const count = products.length;

  /*
   * =========================================================
   * DYNAMIC GRID COLUMNS
   *
   * Mobile-first: 2 columns always
   * Tab/desktop: count ke hisaab se expand
   * =========================================================
   */
  const gridClasses =
    count === 1
      ? "grid-cols-1 max-w-xs mx-auto"
      : count === 2
        ? "grid-cols-2 max-w-3xl mx-auto"
        : count === 3
          ? "grid-cols-2 sm:grid-cols-3 max-w-5xl mx-auto"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div
      className={`
        mt-8 grid gap-3 sm:mt-10 sm:gap-5 lg:gap-6
        ${gridClasses}
      `}
    >
      {products.map((product) => (
        <ProductCard
          key={
            packaging === "Glass Jar"
              ? `glass-jar-${product.id}`
              : product.id
          }
          product={product}
          packaging={packaging}
        />
      ))}
    </div>
  );
}

export default ProductGrid;