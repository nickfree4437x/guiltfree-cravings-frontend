import { useEffect, useState } from "react";
import { getProducts, type Product } from "../../api/productApi";
import ProductCard from "../product/ProductCard";

// ─── Types ────────────────────────────────────────────────
interface RecommendedProductsProps {
  currentProductId: number;
}

// ─── Shared Card Classes ──────────────────────────────────
const CARD_WIDTH =
  "w-full max-w-[280px] sm:w-[calc(50%-10px)] md:w-[280px] lg:w-[260px]";

// ─── Component ────────────────────────────────────────────
function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommended (exclude current product + inactive)
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        const recommended = allProducts.filter(
          (p) => p.id !== currentProductId && p.isActive
        );
        setProducts(recommended);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRecommendedProducts();
  }, [currentProductId]);

  // ─── Loading skeleton ───────────────────────────────────
  if (loading) {
    return (
      <section className="w-full">
        {/* Header skeleton */}
        <div className="mb-5 text-center">
          <div className="mx-auto h-5 w-52 animate-pulse rounded bg-[#F5EFE6]" />
          <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#F5EFE6]" />
        </div>

        {/* Product skeletons */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`${CARD_WIDTH} overflow-hidden rounded-md bg-white shadow-[0_8px_30px_-18px_rgba(82,55,43,0.22)]`}
            >
              <div className="aspect-square w-full animate-pulse bg-[#F5EFE6]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 animate-pulse rounded bg-[#F5EFE6]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#F5EFE6]" />
                <div className="h-9 w-full animate-pulse rounded bg-[#F5EFE6]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // No recommendations → render nothing
  if (products.length === 0) return null;

  // ─── Recommendations ────────────────────────────────────
  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-[20px] font-semibold tracking-wide text-[#2c2c2c] sm:text-[24px]">
          RECOMMENDED
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {products.map((product) => (
          <div key={product.id} className={CARD_WIDTH}>
            <ProductCard product={product} packaging="Plastic Box" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedProducts;