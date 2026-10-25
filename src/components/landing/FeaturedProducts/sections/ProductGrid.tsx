import ProductCard from "../../../product/ProductCard";
import type { Product } from "../../../../api/productApi";

// ─── Types ────────────────────────────────────────────────
interface ProductGridProps {
  products: Product[];
  packaging: "Plastic Box" | "Glass Jar" | "Cardboard Box";
}

// ─── Component ────────────────────────────────────────────
function ProductGrid({ products, packaging }: ProductGridProps) {
  const count = products.length;

  // Dynamic grid based on number of products
  const gridClasses =
    count === 1
      ? "grid-cols-1 max-w-[340px] mx-auto"
      : count === 2
        ? "grid-cols-2 sm:grid-cols-2 max-w-[760px] mx-auto"
        : count === 3
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 max-w-[1080px] mx-auto"
          : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";

  // Unique key per packaging type
  const keyPrefix =
    packaging === "Glass Jar"
      ? "glass-jar"
      : packaging === "Cardboard Box"
        ? "cardboard-box"
        : "plastic-box";

  return (
    <div className="relative mt-8 sm:mt-10 lg:mt-12">
      <div
        className={`relative grid items-stretch gap-3 sm:gap-6 lg:gap-7 xl:gap-8 ${gridClasses}`}
      >
        {products.map((product) => (
          <div
            key={`${keyPrefix}-${product.id}`}
            className="min-w-0 transition-transform duration-300"
          >
            <ProductCard product={product} packaging={packaging} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;