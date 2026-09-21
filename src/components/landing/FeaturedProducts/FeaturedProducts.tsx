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

  const glassJarProducts = products.filter(
    (product) =>
      product.variants.some(
        (variant) =>
          variant.packaging === "Glass Jar"
      ) &&
      Boolean(product.glassJarImage)
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
      <div className="mx-auto w-full max-w-7xl">

        {/* SECTION HEADER */}
        <FeaturedProductsHeader />

        {/* LOADING */}
        {loading && <ProductSkeletonGrid />}

        {/* ERROR */}
        {!loading && error && (
          <ProductErrorState message={error} />
        )}

        {/* MAIN PRODUCTS */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <ProductGrid
              products={products}
              packaging="Regular"
            />
          )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <ProductEmptyState />
          )}

        {/* GLASS JAR COLLECTION */}
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