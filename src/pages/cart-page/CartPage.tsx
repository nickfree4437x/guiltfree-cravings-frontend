import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OtpAuthModal from "../../components/auth/OtpAuthModal";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

function CartPage() {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const items = useCartStore((state) => state.items);

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const cartTotal = getCartTotal();

  /*
   * =========================================================
   * PROCEED TO CHECKOUT
   * =========================================================
   *
   * Already logged in:
   *      → Go directly to checkout
   *
   * Not logged in:
   *      → Open OTP authentication modal
   */

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
      return;
    }

    setIsAuthModalOpen(true);
  };

  /*
   * =========================================================
   * OTP AUTH SUCCESS
   * =========================================================
   *
   * OTP verification succeeds:
   *      1. Close modal
   *      2. Continue to checkout
   */

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate("/checkout");
  };

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full text-center">

            {/* Icon */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4d3]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-9 w-9 text-[#8b542f]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>
            </div>

            {/* Heading */}

            <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Cart is Empty
            </h1>

            {/* Description */}

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
              Looks like you haven't added anything to your
              cart yet. Explore our delicious homemade
              cravings and find something you love.
            </p>

            {/* CTA */}

            <Link
              to="/#products"
              className="mt-8 inline-flex rounded-full bg-[#8b542f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Explore Products
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * CART WITH ITEMS
   * =========================================================
   */

  return (
    <>
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="mb-10">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b542f] transition hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              <span aria-hidden="true">←</span>
              Continue Shopping
            </Link>

            <div className="mt-7">

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
                Your Selection
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Review your selected cravings before continuing.
              </p>

            </div>
          </div>

          {/* =====================================================
              CART LAYOUT
          ===================================================== */}

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

            {/* ===================================================
                CART ITEMS
            =================================================== */}

            <section
              className="space-y-4"
              aria-label="Shopping cart items"
            >

              {items.map((item) => {
                const itemSubtotal =
                  item.variant.price * item.quantity;

                const variantLabel = `${item.variant.quantity}${item.variant.unit}`;

                return (
                  <article
                    key={`${item.product.id}-${item.variant.id}`}
                    className="rounded-3xl border border-[#eadfd3] bg-white p-4 shadow-sm sm:p-5"
                  >

                    <div className="flex gap-4 sm:gap-6">

                      {/* =================================================
                          PRODUCT IMAGE
                      ================================================= */}

                      <Link
                        to={`/products/${item.product.id}`}
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5eadf] sm:h-32 sm:w-32"
                        aria-label={`View ${item.product.name}`}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      </Link>

                      {/* =================================================
                          PRODUCT CONTENT
                      ================================================= */}

                      <div className="min-w-0 flex-1">

                        {/* Product Header */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <Link
                              to={`/products/${item.product.id}`}
                              className="text-base font-bold text-slate-900 transition hover:text-[#8b542f] sm:text-lg"
                            >
                              {item.product.name}
                            </Link>

                            {/* Variant */}

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-[#f3e4d3] px-3 py-1 text-xs font-semibold text-[#8b542f]">
                                {variantLabel}
                              </span>

                              <span className="text-xs text-slate-400">
                                •
                              </span>

                              <span className="text-xs font-medium capitalize text-slate-500">
                                {item.variant.packaging}
                              </span>

                            </div>

                            {/* Description */}

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {item.product.description}
                            </p>

                          </div>

                          {/* Remove */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.variant.id
                              )
                            }
                            className="shrink-0 text-sm font-medium text-slate-400 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label={`Remove ${item.product.name}, ${variantLabel}, from cart`}
                          >
                            Remove
                          </button>

                        </div>

                        {/* =================================================
                            PRICE + QUANTITY + SUBTOTAL
                        ================================================= */}

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">

                          {/* Unit Price */}

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#8b542f]">
                              ₹{item.variant.price}
                            </p>
                          </div>

                          {/* Quantity */}

                          <div>

                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                              Quantity
                            </p>

                            <div
                              className="flex items-center overflow-hidden rounded-full border border-[#d9c7b7] bg-[#fffaf5]"
                              aria-label={`Quantity for ${item.product.name}`}
                            >

                              {/* Decrease */}

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.variant.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity === 1}
                                className="flex h-9 w-9 items-center justify-center text-lg text-slate-600 transition hover:bg-[#f5eadf] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
                                aria-label={`Decrease quantity of ${item.product.name}`}
                              >
                                −
                              </button>

                              {/* Current Quantity */}

                              <span
                                className="flex h-9 min-w-10 items-center justify-center px-2 text-sm font-semibold text-slate-900"
                                aria-live="polite"
                              >
                                {item.quantity}
                              </span>

                              {/* Increase */}

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.variant.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg text-slate-600 transition hover:bg-[#f5eadf] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
                                aria-label={`Increase quantity of ${item.product.name}`}
                              >
                                +
                              </button>

                            </div>

                          </div>

                          {/* Item Subtotal */}

                          <div className="text-right">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Subtotal
                            </p>

                            <p className="mt-1 text-base font-bold text-slate-900">
                              ₹{itemSubtotal}
                            </p>

                          </div>

                        </div>

                      </div>
                    </div>
                  </article>
                );
              })}

              {/* =================================================
                  CLEAR CART
              ================================================= */}

              <div className="flex justify-end pt-2">

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-slate-500 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Clear Cart
                </button>

              </div>

            </section>

            {/* ===================================================
                ORDER SUMMARY
            =================================================== */}

            <aside className="lg:sticky lg:top-24">

              <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">

                  {/* Subtotal */}

                  <div className="flex items-center justify-between gap-4 text-sm">

                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{cartTotal}
                    </span>

                  </div>

                  {/* Delivery */}

                  <div className="flex items-center justify-between gap-4 text-sm">

                    <span className="text-slate-500">
                      Delivery
                    </span>

                    <span className="font-medium text-slate-500">
                      Calculated later
                    </span>

                  </div>

                  <div className="h-px bg-[#eadfd3]" />

                  {/* Total */}

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#8b542f]">
                      ₹{cartTotal}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    CHECKOUT
                ================================================= */}

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="mt-7 block w-full rounded-full bg-[#8b542f] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Secure checkout. Payment options will be
                  available at the next step.
                </p>

                {/* =================================================
                    CONTINUE SHOPPING
                ================================================= */}

                <Link
                  to="/#products"
                  className="mt-4 block text-center text-sm font-semibold text-[#8b542f] transition hover:text-[#744324]"
                >
                  Continue Shopping
                </Link>

              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* =========================================================
          OTP AUTH MODAL
      ========================================================= */}

      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() => {
            setIsAuthModalOpen(false);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default CartPage;