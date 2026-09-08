import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlistStore } from "../../store/wishlistStore";

function WishlistPage() {
  /*
   * =========================================================
   * WISHLIST PAGE
   * =========================================================
   *
   * - Wishlist items from Zustand
   * - Persisted wishlist
   * - Empty state
   * - Remove from wishlist
   * - View product
   * - Continue shopping
   */

  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffaf5] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mx-auto max-w-2xl text-center">

          <h1 className="mt-4 text-[18px] md:text-[24px] font-bold tracking-tight text-slate-900">
            Wishlist
          </h1>

          <p className="mx-auto mt-0 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            Save your favorite products and come back to them whenever you
            want.
          </p>
        </div>

        {/* =================================================
            WISHLIST CONTENT
        ================================================= */}

        {wishlistItems.length === 0 ? (
          <section className="mt-4 rounded-xl border border-[#eadfd3] bg-white px-6 py-14 text-center shadow-sm sm:mt-10 sm:px-10 sm:py-16">

            <h2 className="mt-4 text-[18px] md:text-[24px] font-semibold tracking-tight text-slate-900">
              Your Wishlist is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[12px] md:text-[14.5px] leading-5 text-slate-500 sm:text-[15px]">
              You haven't added any products to your wishlist yet. Explore
              our products and save the ones you love.
            </p>

            {/* Shop Button */}

            <Link
              to="/#products"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#8b542f] px-6 py-2.5 text-sm text-white transition-all duration-200 hover:bg-[#744324] hover:shadow-md focus:outline-none"
            >
              Explore Products
            </Link>

          </section>
        ) : (
          <section className="mt-8 sm:mt-10">

            {/* Wishlist Summary */}

            <div className="mb-5 flex items-center justify-between border-b border-[#eadfd3] pb-4">
              <p className="text-sm text-slate-500">
                <span className="text-slate-900">
                  {wishlistItems.length}
                </span>{" "}
                {wishlistItems.length === 1 ? "product" : "products"} saved
              </p>
            </div>

            {/* Product Grid */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {wishlistItems.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-[#eadfd3] bg-white transition-all duration-300"
                >

                  {/* =========================
                      PRODUCT IMAGE
                  ========================= */}

                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white p-5 sm:h-64">

                    <Link
                      to={`/products/${product.id}`}
                      aria-label={`View ${product.name}`}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain object-center transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Remove Wishlist */}

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      title="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd3] bg-white/95 text-[#8b542f] hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none"
                    >
                      <Trash2
                        className="h-4 w-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>

                  </div>

                  {/* =========================
                      PRODUCT CONTENT
                  ========================= */}

                  <div className="p-5 sm:p-6">

                    <Link
                      to={`/products/${product.id}`}
                      className="block"
                    >
                      <h2 className="text-[16px] md:text-[20px] font-semibold tracking-tight text-slate-900">
                        {product.name}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-[12px] font-[350] leading-5 text-slate-600 sm:text-[13px]">
                        {product.description}
                      </p>
                    </Link>

                    {/* =========================
                        REGULAR PRICING
                    ========================= */}

                    <div className="mt-2 border-t border-[#eee4dc] pt-2">

                      <div className="flex items-end justify-between gap-3">

                        <div className="flex items-center gap-3">
                          {product.variants
                            .filter(
                              (variant) =>
                                variant.packaging === "Regular"
                            )
                            .map((variant, index, variants) => (
                              <div
                                key={variant.id}
                                className="flex items-center gap-3"
                              >
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                                    {variant.quantity}
                                    {variant.unit}
                                  </p>

                                  <p className="mt-1 text-[13px] font-semibold text-slate-900">
                                    ₹{variant.price}
                                  </p>
                                </div>

                                {index < variants.length - 1 && (
                                  <div className="h-7 w-px bg-[#e3d7cd]" />
                                )}
                              </div>
                            ))}
                        </div>

                        {/* View Product */}

                        <Link
                          to={`/products/${product.id}`}
                          aria-label={`View ${product.name}`}
                          className="shrink-0 rounded-full bg-[#8b542f] px-4 py-1.5 text-[12px] text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                        >
                          View Product
                        </Link>

                      </div>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          </section>
        )}

      </div>
    </main>
  );
}

export default WishlistPage;