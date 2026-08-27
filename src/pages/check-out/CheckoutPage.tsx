import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  updateMyProfile,
} from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
}

interface CheckoutErrors {
  fullName: string;
  email: string;
}

function CheckoutPage() {
  const navigate = useNavigate();

  /*
   * =========================================================
   * CART
   * =========================================================
   */

  const items = useCartStore(
    (state) => state.items
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const updateUser = useAuthStore(
    (state) => state.updateUser
  );

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [formData, setFormData] =
    useState<CheckoutFormData>({
      fullName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    });

  const [errors, setErrors] =
    useState<CheckoutErrors>({
      fullName: "",
      email: "",
    });

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const cartTotal = getCartTotal();

  /*
   * =========================================================
   * AUTH GUARD
   * =========================================================
   *
   * Checkout is only available to authenticated users.
   */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /*
   * =========================================================
   * SYNC USER DETAILS
   * =========================================================
   */

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,

      fullName:
        current.fullName ||
        user.name ||
        "",

      phone: user.phone,

      email:
        current.email ||
        user.email ||
        "",
    }));
  }, [user]);

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
          <div className="w-full text-center">

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

            <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Cart is Empty
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
              Add some delicious cravings to your
              cart before proceeding to checkout.
            </p>

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
   * INPUT CHANGE
   * =========================================================
   */

  const handleChange = (
    field: "fullName" | "email",
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSubmitError("");
  };

  /*
   * =========================================================
   * VALIDATE FORM
   * =========================================================
   */

  const validateForm = () => {
    const newErrors: CheckoutErrors = {
      fullName: "",
      email: "",
    };

    /*
     * Full Name
     */

    const trimmedName =
      formData.fullName.trim();

    if (!trimmedName) {
      newErrors.fullName =
        "Please enter your full name.";
    } else if (trimmedName.length < 2) {
      newErrors.fullName =
        "Please enter a valid full name.";
    } else if (trimmedName.length > 100) {
      newErrors.fullName =
        "Name cannot exceed 100 characters.";
    }

    /*
     * Email
     */

    const trimmedEmail =
      formData.email.trim();

    if (!trimmedEmail) {
      newErrors.email =
        "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(
      (error) => error !== ""
    );
  };

  /*
   * =========================================================
   * SUBMIT CHECKOUT
   * =========================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /*
     * Prevent duplicate submission.
     */

    if (isSubmitting) {
      return;
    }

    /*
     * Authentication safety check.
     */

    if (
      !isAuthenticated ||
      !user ||
      !token
    ) {
      navigate("/cart", {
        replace: true,
      });

      return;
    }

    /*
     * Validate form.
     */

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    /*
     * Clear previous API error.
     */

    setSubmitError("");

    /*
     * Clean customer data.
     */

    const fullName =
      formData.fullName.trim();

    const email =
      formData.email.trim().toLowerCase();

    /*
     * Start loading.
     */

    setIsSubmitting(true);

    try {
      /*
       * =======================================================
       * SAVE CUSTOMER PROFILE
       * =======================================================
       *
       * Name + email are persisted in PostgreSQL.
       */

      const updatedUser =
        await updateMyProfile(
          {
            name: fullName,
            email,
          },
          token
        );

      /*
       * =======================================================
       * UPDATE AUTH STORE
       * =======================================================
       *
       * Keeps Zustand + localStorage synchronized
       * with PostgreSQL.
       */

      updateUser(updatedUser);

      /*
       * =======================================================
       * CUSTOMER DATA FOR REVIEW PAGE
       * =======================================================
       */

      const customer = {
        fullName:
          updatedUser.name ??
          fullName,

        phone:
          updatedUser.phone,

        email:
          updatedUser.email ??
          email,
      };

      /*
       * =======================================================
       * GO TO REVIEW
       * =======================================================
       */

      navigate(
        "/checkout/review",
        {
          state: {
            customer,
          },
        }
      );
    } catch (error: any) {
      console.error(
        "Failed to update customer profile:",
        error
      );

      /*
       * Axios response error
       */

      const apiMessage =
        error?.response?.data?.message;

      setSubmitError(
        apiMessage ||
          "Unable to save your details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * =========================================================
   * NOT AUTHENTICATED
   * =========================================================
   */

  if (!isAuthenticated || !user) {
    return null;
  }

  /*
   * =========================================================
   * CHECKOUT UI
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back To Cart */}

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b542f] transition hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          <span aria-hidden="true">
            ←
          </span>

          Back to Cart
        </Link>

        {/* Page Header */}

        <div className="mt-8">

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Almost There
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter your details and review your
            selected cravings before placing your
            order.
          </p>

        </div>

        {/* Checkout Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start"
        >

          {/* Customer Information */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Customer Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These details will be used for your
                order.
              </p>

            </div>

            {/* Verified User */}

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                ✓
              </div>

              <div>

                <p className="text-sm font-semibold text-green-800">
                  Mobile number verified
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700">
                  +91 {user.phone}
                </p>

              </div>

            </div>

            <div className="mt-7 space-y-6">

              {/* Full Name */}

              <div>

                <label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-slate-800"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    handleChange(
                      "fullName",
                      event.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    errors.fullName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
                  }`}
                />

                {errors.fullName && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.fullName}
                  </p>
                )}

              </div>

              {/* Mobile Number */}

              <div>

                <label
                  htmlFor="phone"
                  className="text-sm font-semibold text-slate-800"
                >
                  Verified Mobile Number
                </label>

                <div className="relative mt-2">

                  <input
                    id="phone"
                    type="tel"
                    value={user.phone}
                    readOnly
                    aria-readonly="true"
                    autoComplete="tel"
                    className="w-full cursor-not-allowed rounded-2xl border border-[#d9c7b7] bg-slate-50 px-4 py-3.5 pr-12 text-sm font-medium text-slate-600 outline-none"
                  />

                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                    aria-label="Verified"
                  >
                    ✓
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This number was verified using OTP and
                  cannot be changed during checkout.
                </p>

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    handleChange(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
                  }`}
                />

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}

              </div>

            </div>

            {/* API Error */}

            {submitError && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm font-medium leading-6 text-red-700">
                  {submitError}
                </p>
              </div>
            )}

            {/* Information Notice */}

            <div className="mt-8 rounded-2xl bg-[#fffaf5] p-4">

              <p className="text-xs leading-5 text-slate-500">
                Your verified mobile number will be
                associated with your order. Your email
                address will be used for order-related
                communication.
              </p>

            </div>

          </section>

          {/* Order Summary */}

          <aside className="lg:sticky lg:top-24">

            <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              {/* Products */}

              <div className="mt-6 space-y-4">

                {items.map((item) => {

                  const itemSubtotal =
                    item.variant.price *
                    item.quantity;

                  const variantLabel =
                    `${item.variant.quantity}${item.variant.unit}`;

                  return (
                    <div
                      key={`${item.product.id}-${item.variant.id}`}
                      className="flex gap-3"
                    >

                      {/* Image */}

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eadf]">

                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />

                      </div>

                      {/* Product */}

                      <div className="min-w-0 flex-1">

                        <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                          {item.product.name}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-1.5">

                          <span className="text-xs font-medium text-[#8b542f]">
                            {variantLabel}
                          </span>

                          <span className="text-xs text-slate-300">
                            •
                          </span>

                          <span className="text-xs capitalize text-slate-400">
                            {item.variant.packaging}
                          </span>

                          <span className="text-xs text-slate-300">
                            •
                          </span>

                          <span className="text-xs text-slate-500">
                            Qty: {item.quantity}
                          </span>

                        </div>

                      </div>

                      {/* Subtotal */}

                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        ₹{itemSubtotal}
                      </p>

                    </div>
                  );
                })}

              </div>

              <div className="my-6 h-px bg-[#eadfd3]" />

              {/* Subtotal */}

              <div className="flex items-center justify-between text-sm">

                <span className="text-slate-500">
                  Subtotal
                </span>

                <span className="font-semibold text-slate-900">
                  ₹{cartTotal}
                </span>

              </div>

              {/* Delivery */}

              <div className="mt-4 flex items-center justify-between text-sm">

                <span className="text-slate-500">
                  Delivery
                </span>

                <span className="font-medium text-slate-400">
                  To be confirmed
                </span>

              </div>

              <div className="my-5 h-px bg-[#eadfd3]" />

              {/* Total */}

              <div className="flex items-center justify-between">

                <span className="text-base font-bold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-[#8b542f]">
                  ₹{cartTotal}
                </span>

              </div>

              {/* Continue */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex w-full items-center justify-center rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />

                    Saving Details...
                  </>
                ) : (
                  "Continue to Review"
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                You'll review your complete order
                before proceeding to payment.
              </p>

            </div>

          </aside>

        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;