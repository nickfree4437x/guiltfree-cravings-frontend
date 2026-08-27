import { useEffect, useState } from "react";

/*
 * =========================================================
 * PRODUCT TYPES
 * =========================================================
 *
 * These match the current Prisma Product structure.
 */

interface ProductVariant {
  id: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;
}

interface AdminProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

/*
 * =========================================================
 * ADMIN PRODUCTS PAGE
 * =========================================================
 */

function AdminProductsPage() {
  const [products, setProducts] = useState<
    AdminProduct[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  /*
   * =======================================================
   * LOAD PRODUCTS
   * =======================================================
   *
   * API integration can be connected here.
   *
   * For now this function is kept separate so the UI
   * structure remains clean.
   */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        /*
         * TODO:
         * Connect admin products API here.
         *
         * Example:
         *
         * const data = await getAdminProducts();
         * setProducts(data);
         */

        setProducts([]);
      } catch (error) {
        console.error(
          "Failed to load admin products:",
          error
        );

        setPageError(
          "Unable to load products right now. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  /*
   * =======================================================
   * FORMAT PRICE
   * =======================================================
   */

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /*
   * =======================================================
   * GET STARTING PRICE
   * =======================================================
   */

  const getStartingPrice = (
    variants: ProductVariant[]
  ) => {
    if (!variants.length) {
      return null;
    }

    return Math.min(
      ...variants.map(
        (variant) => variant.price
      )
    );
  };

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Catalogue
            </span>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your products and their basic
              information.
            </p>
          </div>

          {/* LOADING CARD */}

          <div className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-12 text-center shadow-sm">

            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading products...
            </p>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Catalogue
            </span>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your products and their basic
              information.
            </p>
          </div>

          {/* ADD PRODUCT */}

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8b542f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            <span
              className="text-base leading-none"
              aria-hidden="true"
            >
              +
            </span>

            Add Product
          </button>

        </div>

        {/* =================================================
            PAGE ERROR
        ================================================= */}

        {pageError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load products
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {pageError}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =================================================
            PRODUCT COUNT
        ================================================= */}

        {!pageError && (
          <div className="mt-8 flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-slate-800">
                All Products
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!pageError &&
          products.length === 0 && (
            <section className="mt-5 rounded-3xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3e8] text-2xl text-[#8b542f]">
                ◫
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No products yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Products added to your catalogue will
                appear here.
              </p>

              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#8b542f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
              >
                <span aria-hidden="true">
                  +
                </span>

                Add Product
              </button>

            </section>
          )}

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        {products.length > 0 && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Variants
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Starting Price
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0e5db]">

                  {products.map((product) => {
                    const startingPrice =
                      getStartingPrice(
                        product.variants
                      );

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-[#fffaf5]"
                      >

                        {/* PRODUCT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd3] bg-[#fffaf5]">

                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-lg text-[#c9a98d]">
                                  ◫
                                </div>
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {product.name}
                              </p>

                              <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                                {product.description}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* VARIANTS */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-semibold text-slate-700">
                            {product.variants.length}
                          </span>

                          <span className="ml-1 text-xs text-slate-400">
                            {product.variants.length ===
                            1
                              ? "variant"
                              : "variants"}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-bold text-slate-800">
                            {startingPrice !== null
                              ? `From ${formatPrice(
                                  startingPrice
                                )}`
                              : "—"}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={[
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                              product.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-1.5 w-1.5 rounded-full",
                                product.isActive
                                  ? "bg-green-500"
                                  : "bg-slate-400",
                              ].join(" ")}
                            />

                            {product.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            className="rounded-xl border border-[#eadfd3] px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#d9c7b7] hover:bg-[#fffaf5] hover:text-[#8b542f]"
                          >
                            Edit
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* MOBILE PRODUCT LIST */}

            <div className="divide-y divide-[#f0e5db] md:hidden">

              {products.map((product) => {
                const startingPrice =
                  getStartingPrice(
                    product.variants
                  );

                return (
                  <article
                    key={product.id}
                    className="p-5"
                  >

                    <div className="flex gap-4">

                      {/* IMAGE */}

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd3] bg-[#fffaf5]">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg text-[#c9a98d]">
                            ◫
                          </div>
                        )}

                      </div>

                      {/* BASIC INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h2 className="truncate text-sm font-bold text-slate-900">
                              {product.name}
                            </h2>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {product.description}
                            </p>

                          </div>

                          <span
                            className={[
                              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                              product.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            {product.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* PRODUCT META */}

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-[#fffaf5] p-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Variants
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {product.variants.length}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#fffaf5] p-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Starting Price
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {startingPrice !== null
                            ? formatPrice(
                                startingPrice
                              )
                            : "—"}
                        </p>

                      </div>

                    </div>

                    {/* EDIT */}

                    <button
                      type="button"
                      className="mt-4 w-full rounded-xl border border-[#eadfd3] px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                    >
                      Edit Product
                    </button>

                  </article>
                );
              })}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

export default AdminProductsPage;