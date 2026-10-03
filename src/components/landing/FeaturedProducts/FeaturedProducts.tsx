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

type PackagingType =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePackaging, setActivePackaging] =
    useState<PackagingType>("Plastic Box");

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
   * PACKAGING PRODUCTS
   * =========================================================
   */

  const filteredProducts = products.filter(
    (product) =>
      product.variants.some(
        (variant) =>
          variant.packaging === activePackaging
      ) &&
      (activePackaging === "Plastic Box"
        ? true
        : activePackaging === "Glass Jar"
          ? Boolean(product.glassJarImage)
          : Boolean(product.cardboardBoxImage))
  );

  const tabs: {
    label: string;
    value: PackagingType;
  }[] = [
    {
      label: "Regular",
      value: "Plastic Box",
    },
    {
      label: "Cardboard Boxes",
      value: "Cardboard Box",
    },
    {
      label: "Glass Jars",
      value: "Glass Jar",
    },
  ];

  return (
    <section
      id="products"
      className="
        overflow-hidden
        bg-[#FFF9F5]
        px-5 py-6
        sm:px-8 sm:py-8
        lg:px-12
        scroll-mt-12
      "
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <FeaturedProductsHeader />

        {/* =====================================================
            PACKAGING TABS
        ===================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-6 flex justify-center sm:mt-8">
            <div
              className="
                inline-flex
                max-w-full
                items-center
                gap-1
                overflow-x-auto
                rounded-md
                border
                border-[#EADBD0]
                bg-white
                p-1
                shadow-sm
                scrollbar-hide
              "
            >
              {tabs.map((tab) => {
                const isActive =
                  activePackaging === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() =>
                      setActivePackaging(tab.value)
                    }
                    className={`
                      shrink-0
                      rounded-md
                      px-4
                      py-1.5
                      text-[12px]
                      tracking-wide
                      transition-all
                      duration-300
                      sm:px-6
                      sm:py-2
                      sm:text-[13px]
                      ${
                        isActive
                          ? "bg-[#B5697A] text-white shadow-sm"
                          : "text-[#6F6259] hover:bg-[#F8E8EC] hover:text-[#B5697A]"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && <ProductSkeletonGrid />}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (
          <ProductErrorState message={error} />
        )}

        {/* =====================================================
            SELECTED PACKAGING PRODUCTS
        ===================================================== */}

        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length > 0 && (
            <ProductGrid
              products={filteredProducts}
              packaging={activePackaging}
            />
          )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <ProductEmptyState />
          )}

        {/* =====================================================
            NO PRODUCTS AT ALL
        ===================================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <ProductEmptyState />
          )}
      </div>
    </section>
  );
}

export default FeaturedProducts;