import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type { CartItem } from "../../store/cartStore";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

import { createOrder } from "../../api/orderApi";

/*
 * =========================================================
 * CUSTOMER DETAILS
 * =========================================================
 */

interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

/*
 * =========================================================
 * REVIEW LOCATION STATE
 * =========================================================
 */

interface ReviewLocationState {
  customer?: CustomerDetails;
}

/*
 * =========================================================
 * REVIEW ORDER PAGE
 * =========================================================
 */

function ReviewOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  /*
   * =======================================================
   * ORDER CREATION STATE
   * =======================================================
   */

  const [isCreatingOrder, setIsCreatingOrder] =
    useState(false);

  const [orderError, setOrderError] =
    useState("");

  /*
   * =======================================================
   * CART
   * =======================================================
   */

  const items = useCartStore(
    (state) => state.items
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  /*
   * =======================================================
   * AUTH
   * =======================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  /*
   * =======================================================
   * CART TOTAL
   * =======================================================
   */

  const cartTotal = getCartTotal();

  /*
   * =======================================================
   * CUSTOMER DETAILS
   * =======================================================
   *
   * Primary source:
   * Checkout navigation state.
   *
   * Fallback:
   * Authenticated user.
   */

  const locationState =
    location.state as
      | ReviewLocationState
      | null;

  const customer =
    locationState?.customer ??
    (user
      ? {
          fullName: user.name ?? "",
          phone: user.phone,
          email: user.email ?? "",
        }
      : undefined);

  /*
   * =======================================================
   * TOTAL QUANTITY
   * =======================================================
   */

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  /*
   * =======================================================
   * CUSTOMER DETAILS VALIDATION
   * =======================================================
   */

  const validateCustomerDetails = () => {
    if (!customer) {
      return false;
    }

    const fullName =
      customer.fullName.trim();

    const email =
      customer.email.trim();

    if (fullName.length < 2) {
      setOrderError(
        "Please enter a valid full name."
      );

      return false;
    }

    if (!email) {
      setOrderError(
        "Please enter your email address."
      );

      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setOrderError(
        "Please enter a valid email address."
      );

      return false;
    }

    return true;
  };

  /*
   * =======================================================
   * EDIT CUSTOMER DETAILS
   * =======================================================
   */

  const handleEditDetails = () => {
    navigate("/checkout", {
      state: {
        customer,
      },
    });
  };

  /*
   * =======================================================
   * PROCEED TO PAYMENT
   * =======================================================
   *
   * Flow:
   *
   * Review Order
   *      ↓
   * Create Order API
   *      ↓
   * Backend validates products/prices
   *      ↓
   * Order created
   *      ↓
   * Payment Page
   *
   * Razorpay will be connected later.
   */

  const handleProceedToPayment = async () => {
    /*
     * Prevent double click / duplicate orders
     */

    if (isCreatingOrder) {
      return;
    }

    /*
     * =====================================================
     * AUTH CHECK
     * =====================================================
     */

    if (!isAuthenticated || !user) {
      navigate("/cart", {
        replace: true,
      });

      return;
    }

    /*
     * =====================================================
     * CART CHECK
     * =====================================================
     */

    if (items.length === 0) {
      setOrderError(
        "Your cart is empty. Please add products before proceeding."
      );

      return;
    }

    /*
     * =====================================================
     * CUSTOMER CHECK
     * =====================================================
     */

    setOrderError("");

    const isCustomerValid =
      validateCustomerDetails();

    if (!isCustomerValid) {
      return;
    }

    /*
     * =====================================================
     * PREPARE ORDER ITEMS
     * =====================================================
     *
     * IMPORTANT:
     *
     * We send only:
     *
     * productId
     * variantId
     * quantity
     *
     * We DO NOT send:
     *
     * price
     * subtotal
     * total
     *
     * Backend calculates those values from DB.
     */

    const orderItems = items.map(
      (item: CartItem) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      })
    );

    /*
     * =====================================================
     * CREATE ORDER
     * =====================================================
     */

    try {
      setIsCreatingOrder(true);

      const order = await createOrder({
        customer: {
          name: customer!.fullName.trim(),
          email: customer!.email
            .trim()
            .toLowerCase(),
        },

        items: orderItems,
      });

      /*
       * ===================================================
       * ORDER CREATED SUCCESSFULLY
       * ===================================================
       *
       * Pass the complete backend order to PaymentPage.
       *
       * Razorpay integration will use this later.
       */

      navigate("/payment", {
        state: {
          order,
          customer,
        },
      });
    } catch (error: any) {
      /*
       * ===================================================
       * API ERROR
       * ===================================================
       */

      console.error(
        "Create order error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create your order. Please try again.";

      setOrderError(message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  /*
   * =======================================================
   * CUSTOMER DETAILS MISSING
   * =======================================================
   */

  if (!customer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e4d3]">
            <span className="text-2xl font-bold text-[#8b542f]">
              !
            </span>
          </div>

          <h1 className="mt-7 text-3xl font-bold text-slate-900 sm:text-4xl">
            Checkout Information Missing
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            Please complete your checkout information
            before reviewing your order.
          </p>

          <Link
            to="/checkout"
            className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Back to Checkout
          </Link>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * EMPTY CART
   * =======================================================
   */

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
        <div className="text-center">

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

          <h1 className="mt-7 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            There are no products available to
            review.
          </p>

          <Link
            to="/#products"
            className="mt-7 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Explore Products
          </Link>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            BACK TO CHECKOUT
        =================================================== */}

        <button
          type="button"
          onClick={handleEditDetails}
          disabled={isCreatingOrder}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b542f] transition hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">
            ←
          </span>

          Back to Checkout
        </button>

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mt-8">

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Final Review
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Review Your Order
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Please review your details and selected
            products before continuing to payment.
          </p>

        </div>

        {/* ===================================================
            REVIEW LAYOUT
        =================================================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-8">

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Customer Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Details saved during checkout.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleEditDetails}
                  disabled={isCreatingOrder}
                  className="w-fit rounded-full border border-[#8b542f] px-5 py-2 text-xs font-semibold text-[#8b542f] transition hover:bg-[#8b542f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit Details
                </button>

              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                {/* Full Name */}

                <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {customer.fullName}
                  </p>

                </div>

                {/* Phone */}

                <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Mobile Number
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    +91 {customer.phone}
                  </p>

                </div>

                {/* Email */}

                <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4 sm:col-span-2">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {customer.email}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                ORDER ITEMS
            ================================================= */}

            <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Your Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}{" "}
                  in your order.
                </p>

              </div>

              <div className="mt-7 divide-y divide-[#eadfd3]">

                {items.map(
                  (
                    item: CartItem
                  ) => {

                    const itemTotal =
                      item.variant.price *
                      item.quantity;

                    const variantLabel =
                      `${item.variant.quantity}${item.variant.unit}`;

                    return (
                      <div
                        key={`${item.product.id}-${item.variant.id}`}
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >

                        {/* Product Image */}

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5eadf] sm:h-24 sm:w-24">

                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />

                        </div>

                        {/* Product Information */}

                        <div className="min-w-0 flex-1">

                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                            {item.product.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#f3e4d3] px-2.5 py-1 text-xs font-semibold text-[#8b542f]">
                              {variantLabel}
                            </span>

                            <span className="text-xs capitalize text-slate-400">
                              {item.variant.packaging}
                            </span>

                          </div>

                          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                            ₹{item.variant.price} ×{" "}
                            {item.quantity}
                          </p>

                        </div>

                        {/* Item Total */}

                        <div className="shrink-0 text-right">

                          <p className="text-sm font-bold text-[#8b542f] sm:text-base">
                            ₹{itemTotal}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">

            <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {/* Items */}

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Items
                  </span>

                  <span className="font-medium text-slate-800">
                    {totalItems}
                  </span>

                </div>

                {/* Subtotal */}

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900">
                    ₹{cartTotal}
                  </span>

                </div>

              </div>

              <div className="my-6 h-px bg-[#eadfd3]" />

              {/* Total */}

              <div className="flex items-center justify-between">

                <span className="text-base font-bold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#8b542f]">
                  ₹{cartTotal}
                </span>

              </div>

              {/* =================================================
                  ORDER ERROR
              ================================================= */}

              {orderError && (
                <div
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4"
                  role="alert"
                >
                  <p className="text-sm font-medium leading-5 text-red-700">
                    {orderError}
                  </p>
                </div>
              )}

              {/* =================================================
                  PROCEED TO PAYMENT
              ================================================= */}

              <button
                type="button"
                onClick={
                  handleProceedToPayment
                }
                disabled={isCreatingOrder}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreatingOrder ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />

                    Creating Order...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>

              {/* =================================================
                  PAYMENT NOTICE
              ================================================= */}

              <div className="mt-4 rounded-2xl bg-[#fffaf5] p-4">

                <p className="text-center text-xs leading-5 text-slate-500">
                  Your order will be created first.
                  Payment will be completed on the
                  next step.
                </p>

              </div>

              {/* =================================================
                  BACK TO CART
              ================================================= */}

              <Link
                to="/cart"
                className={`mt-4 block text-center text-xs font-semibold text-[#8b542f] transition hover:text-[#744324] ${
                  isCreatingOrder
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                ← Return to Cart
              </Link>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default ReviewOrderPage;