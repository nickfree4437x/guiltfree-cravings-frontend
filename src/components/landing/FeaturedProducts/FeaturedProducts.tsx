import { useEffect, useState } from "react";

import {
  getProducts,
  type Product,
} from "../../../api/productApi";

import FeaturedProductsHeader from "./sections/FeaturedProductsHeader";
import ProductGrid from "./sections/ProductGrid";
import ProductSkeletonGrid from "./sections/ProductSkeletonGrid";
import ProductErrorState from "./sections/ProductErrorState";
import ProductEmptyState from "./sections/ProductEmptyState";
import GlassJarCollection from "./sections/GlassJarCollection";

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setError(
          "Unable to load products right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  /*
   * =========================================================
   * GLASS JAR PRODUCTS
   * =========================================================
   */
  const glassJarProducts = products.filter(
    (product) =>
      product.variants.some(
        (variant) =>
          variant.packaging === "Glass Jar"
      ) &&
      Boolean(product.glassJarImage)
  );

  /*
   * =========================================================
   * CARDBOARD BOX PRODUCTS
   * =========================================================
   */
  const cardboardBoxProducts = products.filter(
    (product) =>
      product.variants.some(
        (variant) =>
          variant.packaging === "Cardboard Box"
      ) &&
      Boolean(product.cardboardBoxImage)
  );

  return (
    <section
      id="products"
      className="
        overflow-hidden
        bg-[#FFFCF7]
        px-5 py-6
        sm:px-8 sm:py-8
        lg:px-12
      "
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* SECTION HEADER */}
        <FeaturedProductsHeader />

        {/* LOADING */}
        {loading && <ProductSkeletonGrid />}

        {/* ERROR */}
        {!loading && error && (
          <ProductErrorState message={error} />
        )}

        {/* =====================================================
            MAIN PRODUCTS — PLASTIC BOX
        ===================================================== */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <ProductGrid
              products={products}
              packaging="Plastic Box"
            />
          )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <ProductEmptyState />
          )}

        {/* =====================================================
            CARDBOARD BOX COLLECTION
        ===================================================== */}
        {!loading &&
          !error &&
          cardboardBoxProducts.length > 0 && (
            <section
              className="
                mt-12
                border-t border-[#E8E1D8]
                pt-8
                sm:mt-14
                sm:pt-16
              "
            >
              {/* SECTION INTRO */}
              <div
                className="
                  mx-auto max-w-3xl
                  text-center
                "
              >
                <h2
                  className="
                    mb-2
                    text-[20px]
                    font-semibold
                    leading-snug
                    tracking-wide
                    text-[#C9788B]
                    sm:text-[24px]
                    md:whitespace-nowrap
                    md:text-[28px]
                  "
                >
                  Classic Cardboard Boxes
                </h2>

                <p
                  className="
                    mx-auto
                    max-w-[580px]
                    text-[12.5px]
                    leading-relaxed
                    tracking-wide
                    text-[#2c2c2c]
                    sm:text-[13.5px]
                    md:text-[14px]
                  "
                >
                  Thoughtfully packed in
                  sturdy cardboard boxes,
                  made for everyday goodness.
                </p>
              </div>

              {/* CARDBOARD BOX PRODUCTS */}
              <ProductGrid
                products={cardboardBoxProducts}
                packaging="Cardboard Box"
              />
            </section>
          )}

        {/* =====================================================
            GLASS JAR COLLECTION — ALWAYS LAST
        ===================================================== */}
        {!loading &&
          !error &&
          glassJarProducts.length > 0 && (
            <GlassJarCollection
              products={glassJarProducts}
            />
          )}

      </div>
    </section>
  );
}

export default FeaturedProducts;