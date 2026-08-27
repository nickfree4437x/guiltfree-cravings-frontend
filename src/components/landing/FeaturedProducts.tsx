import { useEffect, useState } from "react";

import ProductCard from "../product/ProductCard";
import {
  getProducts,
  type Product,
} from "../../api/productApi";

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

  const glassJarProducts = products
    .map((product) => ({
      ...product,
      glassJarVariants: product.variants.filter(
        (variant) => variant.packaging === "Glass Jar"
      ),
    }))
    .filter((product) => product.glassJarVariants.length > 0);

  return (
    <section
      id="products"
      className="bg-[#fffaf5] px-6 py-20 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================
            SECTION HEADER
        ========================= */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b542f]">
            About The Products
          </span>

          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
            Four Recipes.
            <span className="block font-serif font-normal italic text-[#8b542f]">
              Zero Regret.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
            This isn't dessert. It's the snack you reach for when 4pm
            hunger hits and a samosa feels like too much and an apple
            feels like not enough. Each laddoo is built around one real,
            honest ingredient — sattu, dates, besan, or dry fruits —
            sweetened only by nature.
          </p>

          <p className="mt-4 font-serif text-lg italic text-[#8b542f] sm:text-xl">
            Pick 250g to fall in love. Pick 500g because you already have.
          </p>

        </div>

        {/* =========================
            LOADING STATE
        ========================= */}
        {loading && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-7">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-[#eadfd3] bg-white"
              >
                <div className="h-48 animate-pulse bg-[#f5eadf] sm:h-52" />

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
          <div className="mt-14 rounded-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center">

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
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:gap-7">

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
          <div className="mt-14 rounded-3xl border border-[#eadfd3] bg-white px-6 py-12 text-center">

            <h3 className="text-xl font-bold text-slate-900">
              No products available
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Please check back soon for our latest cravings.
            </p>

          </div>
        )}

        {/* =========================
            GLASS JAR SECTION
        ========================= */}
        {!loading && !error && glassJarProducts.length > 0 && (
          <div className="mt-20 border-t border-[#e5d9cf] pt-16 sm:mt-24 sm:pt-20">

            {/* Glass Jar Header */}
            <div className="mx-auto max-w-3xl text-center">

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
                A Better Way To Enjoy Them
              </span>

              <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Now in Traditional Glass Jars
              </h3>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Some things deserve better than a plastic tub. Our Dry Fruit
                Sattu and Dates Delight laddoos now come in reusable glass jars
                — because what's inside is worth the good packaging, and the
                planet deserves it too.
              </p>

            </div>

            {/* Glass Jar Products */}
            <div className="mx-auto mt-9 grid max-w-4xl gap-5 sm:grid-cols-2">

              {glassJarProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-[#e3d6cb] bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                >

                  {/* Product Header */}
                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b542f]">
                        Traditional Glass Jar
                      </span>

                      <h4 className="mt-2 text-xl font-bold leading-snug text-slate-900">
                        {product.name}
                      </h4>

                    </div>

                    {/* Check Icon */}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5e9dd] text-sm font-bold text-[#8b542f]"
                    >
                      ✓
                    </span>

                  </div>

                  {/* Pricing */}
                  <div className="mt-6 flex items-center gap-5">

                    {product.glassJarVariants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="flex items-center gap-5"
                      >

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            {variant.quantity}
                            {variant.unit}
                          </p>

                          <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                            ₹{variant.price}
                          </p>

                        </div>

                        {index <
                          product.glassJarVariants.length - 1 && (
                          <div className="h-7 w-px bg-[#e3d7cd]" />
                        )}

                      </div>
                    ))}

                  </div>

                </article>
              ))}

            </div>

          </div>
        )}

        {/* =========================
            BRAND STATEMENT
        ========================= */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#e5d9cf] pt-7 text-center sm:mt-16 sm:flex-row sm:text-left">

          <p className="text-sm font-medium text-slate-600">
            Real ingredients
            <span className="mx-2 text-[#d7c4b4]">•</span>
            Honest recipes
            <span className="mx-2 text-[#d7c4b4]">•</span>
            No unnecessary extras
          </p>

          <p className="font-serif text-lg italic text-[#8b542f]">
            Made to be enjoyed.
          </p>

        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;