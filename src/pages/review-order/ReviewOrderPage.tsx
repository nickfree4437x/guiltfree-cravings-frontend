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
import {
  validateOffer,
  type ValidateOfferResponse,
} from "../../api/offerApi";

import ReviewCheckoutHeader from "../../components/review/ReviewCheckoutHeader";
import ReviewCustomerInfo from "../../components/review/ReviewCustomerInfo";
import ReviewOrderItems from "../../components/review/ReviewOrderItems";
import ReviewOrderSummary from "../../components/review/ReviewOrderSummary";
import ReviewMissingCustomer from "../../components/review/ReviewMissingCustomer";
import ReviewEmptyCart from "../../components/review/ReviewEmptyCart";

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
   * OFFER STATE
   * =======================================================
   */

  const [offerCode, setOfferCode] =
    useState("");

  const [appliedOffer, setAppliedOffer] =
    useState<ValidateOfferResponse | null>(null);

  const [offerError, setOfferError] =
    useState("");

  const [isApplyingOffer, setIsApplyingOffer] =
    useState(false);

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
   * LOCATION STATE
   * =======================================================
   */

  const locationState =
    location.state as
      | ReviewLocationState
      | null;

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
   * =======================================================
   */

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
   * FINAL REVIEW TOTAL
   * =======================================================
   */

  const finalTotal =
    appliedOffer?.totalAmount ??
    cartTotal;

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

    /*
     * -----------------------------------------------------
     * FULL NAME
     * -----------------------------------------------------
     */

    if (fullName.length < 2) {
      setOrderError(
        "Please enter a valid full name."
      );

      return false;
    }

    /*
     * -----------------------------------------------------
     * EMAIL
     * -----------------------------------------------------
     */

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
   * APPLY OFFER
   * =======================================================
   */

  const handleApplyOffer = async () => {
    if (isApplyingOffer) {
      return;
    }

    const trimmedCode =
      offerCode.trim().toUpperCase();

    if (!trimmedCode) {
      setOfferError(
        "Please enter an offer code."
      );

      return;
    }

    if (cartTotal <= 0) {
      setOfferError(
        "Your cart total must be greater than ₹0."
      );

      return;
    }

    setOfferError("");
    setOrderError("");
    setIsApplyingOffer(true);

    try {
      const result =
        await validateOffer(
          trimmedCode,
          cartTotal
        );

      setAppliedOffer(result);

      /*
       * Keep the normalized code returned
       * by the backend.
       */

      setOfferCode(
        result.offer.code
      );
    } catch (error: any) {
      console.error(
        "Validate offer error:",
        error
      );

      setAppliedOffer(null);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to apply this offer. Please try again.";

      setOfferError(message);
    } finally {
      setIsApplyingOffer(false);
    }
  };

  /*
   * =======================================================
   * REMOVE OFFER
   * =======================================================
   */

  const handleRemoveOffer = () => {
    if (isCreatingOrder) {
      return;
    }

    setAppliedOffer(null);
    setOfferError("");
    setOfferCode("");
  };

  /*
   * =======================================================
   * EDIT CUSTOMER DETAILS
   * =======================================================
   */

  const handleEditDetails = () => {
    if (isCreatingOrder) {
      return;
    }

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
   */

  const handleProceedToPayment = async () => {
    /*
     * -----------------------------------------------------
     * PREVENT DUPLICATE ORDER CREATION
     * -----------------------------------------------------
     */

    if (isCreatingOrder) {
      return;
    }

    /*
     * -----------------------------------------------------
     * AUTH CHECK
     * -----------------------------------------------------
     */

    if (
      !isAuthenticated ||
      !user
    ) {
      navigate("/cart", {
        replace: true,
      });

      return;
    }

    /*
     * -----------------------------------------------------
     * CART CHECK
     * -----------------------------------------------------
     */

    if (items.length === 0) {
      setOrderError(
        "Your cart is empty. Please add products before proceeding."
      );

      return;
    }

    /*
     * -----------------------------------------------------
     * CUSTOMER CHECK
     * -----------------------------------------------------
     */

    setOrderError("");

    const isCustomerValid =
      validateCustomerDetails();

    if (!isCustomerValid) {
      return;
    }

    /*
     * -----------------------------------------------------
     * OFFER SAFETY CHECK
     * -----------------------------------------------------
     *
     * If user has entered an offer code but it has not
     * been successfully validated, do not continue.
     * -----------------------------------------------------
     */

    if (
      offerCode.trim() &&
      !appliedOffer
    ) {
      setOfferError(
        "Please apply the offer code before continuing."
      );

      return;
    }

    /*
     * -----------------------------------------------------
     * PREPARE ORDER ITEMS
     * -----------------------------------------------------
     *
     * Only product/variant IDs + quantity are sent.
     *
     * Backend remains responsible for:
     *
     * - product price
     * - variant price
     * - subtotal
     * - discount
     * - final total
     * -----------------------------------------------------
     */

    const orderItems = items.map(
      (item: CartItem) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      })
    );

    /*
     * -----------------------------------------------------
     * CREATE ORDER
     * -----------------------------------------------------
     */

    try {
      setIsCreatingOrder(true);

      const order =
        await createOrder({
          customer: {
            name:
              customer!.fullName.trim(),

            email:
              customer!.email
                .trim()
                .toLowerCase(),
          },

          items: orderItems,
        });

      /*
       * ---------------------------------------------------
       * ORDER CREATED
       * ---------------------------------------------------
       */

      navigate("/payment", {
        state: {
          order,
          customer,

          /*
           * Keep the validated offer available for the
           * payment flow until backend order integration
           * is completed.
           */

          appliedOffer,
        },
      });
    } catch (error: any) {
      /*
       * ---------------------------------------------------
       * API ERROR
       * ---------------------------------------------------
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
      <ReviewMissingCustomer />
    );
  }

  /*
   * =======================================================
   * EMPTY CART
   * =======================================================
   */

  if (items.length === 0) {
    return (
      <ReviewEmptyCart />
    );
  }

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <ReviewCheckoutHeader
          isCreatingOrder={
            isCreatingOrder
          }
        />

        {/* =================================================
            REVIEW LAYOUT
        ================================================= */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-8">

            {/* ===============================================
                CUSTOMER INFORMATION
            =============================================== */}

            <ReviewCustomerInfo
              customer={customer}
              isCreatingOrder={
                isCreatingOrder
              }
              onEdit={
                handleEditDetails
              }
            />

            {/* ===============================================
                ORDER ITEMS
            =============================================== */}

            <ReviewOrderItems
              items={items}
              totalItems={totalItems}
            />

            {/* ===============================================
                OFFER / COUPON
            =============================================== */}

            <section
              className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-[0_10px_30px_rgba(117,69,39,0.04)] sm:p-6"
              aria-label="Offer code"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b542f]">
                  Offers & Savings
                </p>

                <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  Have an offer code?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Apply your available offer before
                  proceeding to payment.
                </p>
              </div>

              {!appliedOffer ? (
                <div className="mt-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={offerCode}
                      onChange={(event) => {
                        setOfferCode(
                          event.target.value
                            .toUpperCase()
                        );

                        setOfferError("");
                      }}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter"
                        ) {
                          event.preventDefault();
                          handleApplyOffer();
                        }
                      }}
                      placeholder="Enter offer code"
                      disabled={
                        isApplyingOffer ||
                        isCreatingOrder
                      }
                      className="min-w-0 flex-1 rounded-xl border border-[#e5d8cc] bg-[#fffaf5] px-4 py-3 text-sm font-medium uppercase tracking-[0.04em] text-slate-900 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={
                        handleApplyOffer
                      }
                      disabled={
                        isApplyingOffer ||
                        isCreatingOrder
                      }
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isApplyingOffer
                        ? "Applying..."
                        : "Apply Offer"}
                    </button>
                  </div>

                  {offerError && (
                    <p
                      className="mt-3 text-sm font-medium text-red-600"
                      role="alert"
                    >
                      {offerError}
                    </p>
                  )}

                  <Link
                    to="/coupons"
                    className="mt-4 inline-flex text-sm font-medium text-[#8b542f] transition hover:text-[#744324]"
                  >
                    View available offers →
                  </Link>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Offer Applied
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-white px-2.5 py-1 text-sm font-bold tracking-wide text-slate-900 ring-1 ring-emerald-100">
                          {appliedOffer.offer.code}
                        </span>

                        <span className="text-sm font-medium text-slate-700">
                          {appliedOffer.offer.name}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveOffer
                      }
                      disabled={
                        isCreatingOrder
                      }
                      className="shrink-0 text-left text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-right"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-emerald-100 pt-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        Subtotal
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        ₹
                        {appliedOffer.subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        You save
                      </p>

                      <p className="mt-1 text-sm font-semibold text-emerald-700">
                        - ₹
                        {appliedOffer.discountAmount.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Offer total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        ₹
                        {appliedOffer.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* =================================================
              RIGHT ORDER SUMMARY
          ================================================= */}

          <aside className="min-w-0 lg:sticky lg:top-24">

            <ReviewOrderSummary
              totalItems={totalItems}
              cartTotal={finalTotal}
              orderError={orderError}
              isCreatingOrder={
                isCreatingOrder
              }
              onProceedToPayment={
                handleProceedToPayment
              }
            />

            {/* ===============================================
                DISCOUNT SUMMARY
            =============================================== */}

            {appliedOffer && (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">
                    Offer discount
                  </span>

                  <span className="text-sm font-semibold text-emerald-700">
                    - ₹
                    {appliedOffer.discountAmount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-3">
                  <span className="text-sm font-semibold text-slate-900">
                    Final total
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    ₹
                    {finalTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>
    </main>
  );
}

export default ReviewOrderPage;