import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../product/ProductCard";
import {
  getProducts,
  type Product,
} from "../../api/productApi";
import { useWishlistStore } from "../../store/wishlistStore";

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const wishlistItems = useWishlistStore(
    (state) => state.items
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          "Unable to load products right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
   * ============================================
   * GLASS JAR PRODUCTS
   * ============================================
   */

  const glassJarProducts = products
    .map((product) => ({
      ...product,
      glassJarVariants: product.variants.filter(
        (variant) => variant.packaging === "Glass Jar"
      ),
    }))
    .filter(
      (product) =>
        product.glassJarVariants.length > 0 &&
        Boolean(product.glassJarImage)
    );

  return (
    <section
      id="products"
      className="bg-[#fffaf5] px-6 py-4 sm:py-6 lg:px-8 lg:py-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================
            SECTION HEADER
        ========================= */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
              About The Products
            </span>
          </div>

          <h2 className="mt-2 text-[18px] font-semibold leading-tight tracking-wide text-[#2c2c2c] sm:text-[22px] md:text-[28px]">
            Four Recipes Zero Regret
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-[12px] font-[350] leading-relaxed text-slate-500 md:text-[14.5px]">
            The snack you reach for at 4pm honest ingredients, naturally
            sweetened, perfectly balanced.
          </p>

          <p className="mt-4 text-[14px] italic text-[#8b542f] md:text-[18px] sm:text-xl">
            Pick 250g to fall in love. Pick 500g because you already have.
          </p>
        </div>

        {/* =========================
            LOADING STATE
        ========================= */}
        {loading && (
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-7">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white"
              >
                <div className="h-64 animate-pulse bg-[#f5eadf] sm:h-72" />

                <div className="space-y-4 p-6 sm:p-7">
                  <div className="h-7 w-2/3 animate-pulse rounded bg-[#f1e5dc]" />

                  <div className="h-5 w-1/2 animate-pulse rounded bg-[#f1e5dc]" />

                  <div className="h-12 w-full animate-pulse rounded bg-[#f1e5dc]" />

                  <div className="h-10 w-full animate-pulse rounded-full bg-[#f1e5dc]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================
            ERROR STATE
        ========================= */}
        {!loading && error && (
          <div className="mx-auto mt-14 max-w-5xl rounded-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              Products unavailable
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            MAIN PRODUCTS
        ========================= */}
        {!loading && !error && products.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:mt-14 lg:gap-7">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!loading && !error && products.length === 0 && (
          <div className="mx-auto mt-14 max-w-5xl rounded-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No products available
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Please check back soon for our latest cravings.
            </p>
          </div>
        )}

        {/* ==================================================
            GLASS JAR COLLECTION
        ================================================== */}
        {!loading && !error && glassJarProducts.length > 0 && (
          <section className="mt-6 border-t border-[#e5d9cf] pt-4 sm:mt-12 sm:pt-10">

            {/* =========================
                SECTION INTRO
            ========================= */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f8eee4] px-4 py-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b542f]">
                  Traditional Glass Jars
                </span>
              </div>

              <h2 className="mt-2 text-[18px] font-semibold leading-tight tracking-wide text-[#2c2c2c] sm:text-[22px] md:text-[28px]">
                Better Packaging, Same Honest Goodness
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-[12px] font-[350] leading-relaxed text-slate-500 md:text-[14.5px]">
                Reusable glass jars. Beautiful. Useful. Better for your treats.
              </p>
            </div>

            {/* =========================
                GLASS JAR PRODUCTS
            ========================= */}
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:mt-14 lg:gap-7">

              {glassJarProducts.map((product) => {
                const isInWishlist = wishlistItems.some(
                  (item) => item.id === product.id
                );

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-md border border-[#eadfd3] bg-white transition duration-300"
                  >

                    {/* =========================
                        PRODUCT IMAGE
                    ========================= */}
                    <div className="relative flex h-60 items-center justify-center overflow-hidden bg-white p-5 sm:h-[290px] sm:p-6">

                      <img
                        src={product.glassJarImage!}
                        alt={`${product.name} Traditional Glass Jar`}
                        loading="lazy"
                        className="h-full w-full object-contain object-center transition-transform duration-500 ease-out"
                      />

                      {/* =========================
                          WISHLIST BUTTON
                      ========================= */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          isInWishlist
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        title={
                          isInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 backdrop-blur-sm focus:outline-none ${
                          isInWishlist
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-[#eadfd3] text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`h-[18px] w-[18px] transition-all duration-200 ${
                            isInWishlist
                              ? ""
                              : ""
                          }`}
                          fill={
                            isInWishlist
                              ? "currentColor"
                              : "none"
                          }
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </button>

                    </div>

                    {/* =========================
                        PRODUCT CONTENT
                    ========================= */}
                    <div className="p-5 sm:p-6">

                      {/* Product Name */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">

                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b542f]">
                            Traditional Glass Jar
                          </p>

                          <h4 className="mt-2 text-[16px] font-semibold tracking-tight text-slate-900 md:text-[20px] sm:text-2xl">
                            {product.name}
                          </h4>

                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-3 line-clamp-2 text-[12px] font-[350] leading-5 text-slate-600 md:text-[14.5px]">
                        {product.description}
                      </p>

                      {/* =========================
                          PRICING + CTA
                      ========================= */}
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#eee4dc] pt-4">

                        {/* Glass Jar Pricing */}
                        <div className="flex flex-wrap items-center gap-3">

                          {product.glassJarVariants.map(
                            (variant, index) => (
                              <div
                                key={variant.id}
                                className="flex items-center gap-3"
                              >
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                                    {variant.quantity}
                                    {variant.unit}
                                  </p>

                                  <p className="mt-1 text-[12px] font-semibold text-slate-900 md:text-[14.5px]">
                                    ₹{variant.price}
                                  </p>
                                </div>

                                {index <
                                  product.glassJarVariants.length -
                                    1 && (
                                  <div className="h-7 w-px bg-[#e3d7cd]" />
                                )}
                              </div>
                            )
                          )}

                        </div>

                        {/* View Product */}
                        <Link
                          to={`/products/${product.id}`}
                          aria-label={`View ${product.name}`}
                          className="shrink-0 rounded-full bg-[#8b542f] px-4 py-2 text-[12px] font-[350] text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 md:text-[13px] sm:px-5"
                        >
                          View Product
                        </Link>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          </section>
        )}

      </div>
    </section>
  );
}

export default FeaturedProducts;