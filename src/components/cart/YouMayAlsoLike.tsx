import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../api/productApi";

import type { Product } from "../../api/productApi";

interface YouMayAlsoLikeProps {
  cartProductIds: number[];
}

function YouMayAlsoLike({
  cartProductIds,
}: YouMayAlsoLikeProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        if (!isMounted) {
          return;
        }

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to fetch recommended products:",
          error
        );

        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(cartProductIds);

    return products
      .filter((product) => !cartIds.has(product.id))
      .slice(0, 4);
  }, [products, cartProductIds]);

  if (
    !loading &&
    recommendedProducts.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="mt-4"
      aria-labelledby="you-may-also-like-title"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-9">
        <h2
          id="you-may-also-like-title"
          className="text-[18px] md:sm:text-[26px] font-bold tracking-tight text-slate-900"
        >
          You May Also Like
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-[12px] md:text-[14.5px] font-[350] leading-6 text-slate-500">
          Discover more wholesome homemade favourites to make your order a little more special.
        </p>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden border border-[#eadfd3] bg-white"
            >
              <div className="aspect-square animate-pulse bg-[#f5eadf]" />

              <div className="space-y-3 p-4">
                <div className="h-4 animate-pulse rounded bg-[#f3e4d3]" />

                <div className="h-3 w-2/3 animate-pulse rounded bg-[#f3e4d3]" />

                <div className="h-8 animate-pulse rounded-md bg-[#f3e4d3]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ===================================================
           PRODUCTS
        =================================================== */

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedProducts.map((product) => {
            const firstVariant =
              product.variants?.[0];

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-lg border border-[#eadfd3] bg-white transition-all duration-300"
              >
                {/* Product Image */}

                <Link
                  to={`/products/${product.id}`}
                  aria-label={`View ${product.name}`}
                  className="block overflow-hidden bg-white"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-500"
                    />
                  </div>
                </Link>

                {/* Product Content */}

                <div className="p-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="line-clamp-1 text-[18px] md:text-[20px] font-semibold text-slate-900 transition-colors"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-1 line-clamp-2 min-h-10 text-[12px] font-[350] md:text-[14.5px] leading-5 text-slate-500">
                    {product.description}
                  </p>

                  {firstVariant && (
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#f0e7df] pt-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                          From
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#8b542f]">
                          ₹{firstVariant.price}
                        </p>
                      </div>

                      <Link
                        to={`/products/${product.id}`}
                        className="inline-flex h-8 font-[350] items-center justify-center rounded-md border border-[#d9c7b7] px-3 text-xs text-[#8b542f] transition-all duration-200 hover:bg-[#f5eadf] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                      >
                        View Product
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default YouMayAlsoLike;