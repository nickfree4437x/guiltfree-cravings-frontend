import { useEffect, useState } from "react";

import {
  getProducts,
  type Product,
} from "../../api/productApi";

import ProductCard from "../product/ProductCard";

interface RecommendedProductsProps {
  currentProductId: number;
}

function RecommendedProducts({
  currentProductId,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH RECOMMENDED PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);

        const allProducts = await getProducts();

        /*
         * Remove the currently viewed product.
         * Only active products are allowed.
         */
        const recommendedProducts = allProducts.filter(
          (product) =>
            product.id !== currentProductId &&
            product.isActive
        );

        setProducts(recommendedProducts);
      } catch (error) {
        console.error(
          "Failed to fetch recommended products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRecommendedProducts();
  }, [currentProductId]);

  /* =========================================================
     LOADING SKELETON
  ========================================================= */

  if (loading) {
    return (
      <section className="w-full">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 text-center">
          <div className="mx-auto h-5 w-52 animate-pulse rounded bg-[#F5EFE6]" />

          <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#F5EFE6]" />
        </div>

        {/* =================================================
            SKELETON PRODUCTS
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            justify-center
            gap-4
            sm:gap-5
          "
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                w-full
                max-w-[280px]
                overflow-hidden
                rounded-md
                bg-white
                shadow-[0_8px_30px_-18px_rgba(82,55,43,0.22)]
                sm:w-[calc(50%-10px)]
                md:w-[280px]
                lg:w-[260px]
              "
            >
              {/* Image skeleton */}
              <div
                className="
                  aspect-square
                  w-full
                  animate-pulse
                  bg-[#F5EFE6]
                "
              />

              {/* Content skeleton */}
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

  /* =========================================================
     NO RECOMMENDED PRODUCTS
  ========================================================= */

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="mb-6 text-center">
        <h2
          className="
            text-[20px]
            font-semibold
            tracking-wide
            text-[#2c2c2c]
            sm:text-[24px]
          "
        >
          RECOMMENDED
        </h2>
      </div>

      {/* =====================================================
          RECOMMENDED PRODUCTS

          flex + justify-center keeps all products centered
          regardless of the number of products.
      ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          justify-center
          gap-4
          sm:gap-5
        "
      >
        {products.map((recommendedProduct) => (
          <div
            key={recommendedProduct.id}
            className="
              w-full
              max-w-[280px]
              sm:w-[calc(50%-10px)]
              md:w-[280px]
              lg:w-[260px]
            "
          >
            <ProductCard
              product={recommendedProduct}
              packaging="Plastic Box"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedProducts;