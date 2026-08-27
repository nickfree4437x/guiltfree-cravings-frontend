import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProductById,
  type Product,
  type ProductVariant,
} from "../../api/productApi";

import { useCartStore } from "../../store/cartStore";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  /* =========================================================
     State
  ========================================================= */

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);

  /* =========================================================
     Cart Store
  ========================================================= */

  const addToCart = useCartStore((state) => state.addToCart);

  /* =========================================================
     Product ID
  ========================================================= */

  const productId = Number(id);

  const isValidProductId =
    Number.isInteger(productId) && productId > 0;

  /* =========================================================
     Fetch Product
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!isValidProductId) {
        setProduct(null);
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setAddedToCart(false);

        const data = await getProductById(productId);

        if (!isMounted) {
          return;
        }

        setProduct(data);

        /*
         * Select first available variant by default.
         *
         * Backend already returns variants sorted by
         * quantity and packaging.
         */
        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        } else {
          setSelectedVariant(null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);

        if (!isMounted) {
          return;
        }

        setProduct(null);
        setSelectedVariant(null);
        setError(
          "We couldn't load this product right now. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId, isValidProductId]);

  /* =========================================================
     Sorted Variants
  ========================================================= */

  const variants = useMemo(() => {
    if (!product) {
      return [];
    }

    return [...product.variants].sort((a, b) => {
      if (a.quantity !== b.quantity) {
        return a.quantity - b.quantity;
      }

      return a.packaging.localeCompare(b.packaging);
    });
  }, [product]);

  /* =========================================================
     Format Variant Quantity
  ========================================================= */

  const formatQuantity = (variant: ProductVariant) => {
    return `${variant.quantity}${variant.unit}`;
  };

  /* =========================================================
     Variant Selection
  ========================================================= */

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setAddedToCart(false);
    setQuantity(1);
  };

  /* =========================================================
     Increase Quantity
  ========================================================= */

  const handleIncreaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
    setAddedToCart(false);
  };

  /* =========================================================
     Decrease Quantity
  ========================================================= */

  const handleDecreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );

    setAddedToCart(false);
  };

  /* =========================================================
     Add To Cart
  ========================================================= */

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      return;
    }

    /*
     * Add the backend product together with the selected
     * variant and quantity.
     *
     * The cart store should persist the selected variant
     * because the same product can have multiple prices.
     */
    addToCart(product, selectedVariant, quantity);

    setAddedToCart(true);
  };

  /* =========================================================
     Loading State
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-5 w-28 rounded-full bg-[#eadfd3]" />

            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Image Skeleton */}
              <div className="h-[420px] rounded-[2rem] bg-[#f0e3d7] sm:h-[520px]" />

              {/* Content Skeleton */}
              <div className="max-w-xl">
                <div className="h-8 w-24 rounded-full bg-[#eadfd3]" />

                <div className="mt-6 h-12 w-4/5 rounded-xl bg-[#eadfd3]" />

                <div className="mt-5 h-8 w-28 rounded-lg bg-[#eadfd3]" />

                <div className="mt-8 h-px bg-[#eadfd3]" />

                <div className="mt-8 space-y-3">
                  <div className="h-4 w-full rounded bg-[#eadfd3]" />
                  <div className="h-4 w-full rounded bg-[#eadfd3]" />
                  <div className="h-4 w-4/5 rounded bg-[#eadfd3]" />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-2xl bg-[#eadfd3]" />
                  <div className="h-24 rounded-2xl bg-[#eadfd3]" />
                </div>

                <div className="mt-8 h-20 rounded-2xl bg-[#eadfd3]" />

                <div className="mt-8 h-14 w-60 rounded-full bg-[#eadfd3]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     Product Not Found / Error
  ========================================================= */

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
            <span className="text-2xl font-bold text-[#8b542f]">
              !
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Product Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            {error ||
              "The product you're looking for doesn't exist or may no longer be available."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Back to Home
            </Link>

            <Link
              to="/products"
              className="inline-flex rounded-full border border-[#8b542f] bg-white px-6 py-3 text-sm font-semibold text-[#8b542f] transition hover:bg-[#f5eadf] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              View Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     No Variants
  ========================================================= */

  const hasVariants = variants.length > 0;

  /* =========================================================
     Render
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            Back Navigation
        ===================================================== */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b542f] transition hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>

        {/* =====================================================
            Product Layout
        ===================================================== */}

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ===================================================
              Product Image
          =================================================== */}

          <div className="overflow-hidden rounded-[2rem] bg-[#f5eadf] lg:sticky lg:top-8">
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
          </div>

          {/* ===================================================
              Product Information
          =================================================== */}

          <div className="max-w-xl">

            {/* Badge */}

            <span className="inline-flex rounded-full bg-[#f3e4d3] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#8b542f]">
              Featured
            </span>

            {/* Product Name */}

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>

            {/* Dynamic Price */}

            {selectedVariant && (
              <p className="mt-5 text-2xl font-bold text-[#8b542f]">
                ₹{selectedVariant.price}
              </p>
            )}

            <div className="mt-7 h-px bg-[#eadfd3]" />

            {/* Product Description */}

            <p className="mt-7 text-base leading-7 text-slate-600 sm:text-lg">
              {product.description}
            </p>

            {/* =================================================
                Product Highlights
            ================================================= */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-[#eadfd3] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quality
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Thoughtfully Made
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadfd3] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Freshly Prepared
                </p>
              </div>

            </div>

            {/* =================================================
                Product Variants
            ================================================= */}

            {hasVariants ? (
              <div className="mt-8">

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-800">
                    Choose Size
                  </p>

                  {selectedVariant && (
                    <p className="text-xs font-medium text-slate-500">
                      {selectedVariant.packaging}
                    </p>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {variants.map((variant) => {
                    const isSelected =
                      selectedVariant?.id === variant.id;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() =>
                          handleVariantChange(variant)
                        }
                        className={`rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 ${
                          isSelected
                            ? "border-[#8b542f] bg-[#f5eadf]"
                            : "border-[#eadfd3] bg-white hover:border-[#c9aa91] hover:bg-[#fffaf5]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span
                          className={`block text-sm font-bold ${
                            isSelected
                              ? "text-[#8b542f]"
                              : "text-slate-900"
                          }`}
                        >
                          {formatQuantity(variant)}
                        </span>

                        <span className="mt-1 block text-sm font-semibold text-slate-700">
                          ₹{variant.price}
                        </span>

                        <span className="mt-1 block text-xs capitalize text-slate-400">
                          {variant.packaging}
                        </span>
                      </button>
                    );
                  })}

                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-[#eadfd3] bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Product currently unavailable
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  This product does not have any available
                  purchase variants right now.
                </p>
              </div>
            )}

            {/* =================================================
                Quantity
            ================================================= */}

            {hasVariants && selectedVariant && (
              <div className="mt-8">

                <p className="text-sm font-semibold text-slate-800">
                  Quantity
                </p>

                <div
                  className="mt-3 flex w-fit items-center overflow-hidden rounded-full border border-[#d9c7b7] bg-white"
                  aria-label="Product quantity"
                >

                  {/* Decrease */}

                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity === 1}
                    className="flex h-11 w-11 items-center justify-center text-lg text-slate-600 transition hover:bg-[#f5eadf] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    −
                  </button>

                  {/* Current Quantity */}

                  <span
                    className="flex h-11 min-w-12 items-center justify-center px-2 text-sm font-semibold text-slate-900"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>

                  {/* Increase */}

                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    className="flex h-11 w-11 items-center justify-center text-lg text-slate-600 transition hover:bg-[#f5eadf] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    +
                  </button>

                </div>
              </div>
            )}

            {/* =================================================
                Selected Product Summary
            ================================================= */}

            {hasVariants && selectedVariant && (
              <div className="mt-7 rounded-2xl border border-[#eadfd3] bg-white p-5">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Selected
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatQuantity(selectedVariant)} ·{" "}
                      <span className="capitalize">
                        {selectedVariant.packaging}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#8b542f]">
                      ₹{selectedVariant.price * quantity}
                    </p>

                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                Add To Cart
            ================================================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!hasVariants || !selectedVariant}
              className={`mt-8 w-full rounded-full px-7 py-4 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:min-w-[240px] ${
                !hasVariants || !selectedVariant
                  ? "cursor-not-allowed bg-slate-300"
                  : addedToCart
                    ? "bg-green-700 hover:bg-green-800 focus:ring-green-700"
                    : "bg-[#8b542f] hover:bg-[#744324] focus:ring-[#8b542f]"
              }`}
            >
              {!hasVariants || !selectedVariant
                ? "Currently Unavailable"
                : addedToCart
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
            </button>

            {/* =================================================
                Cart Feedback
            ================================================= */}

            {addedToCart && selectedVariant && (
              <div
                className="mt-4 flex flex-wrap items-center gap-3"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-medium text-green-700">
                  {quantity} × {product.name} (
                  {formatQuantity(selectedVariant)}) added to
                  your cart.
                </p>

                <Link
                  to="/cart"
                  className="text-sm font-semibold text-[#8b542f] underline underline-offset-4 transition hover:text-[#744324]"
                >
                  View Cart
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;