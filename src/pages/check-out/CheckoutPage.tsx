import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api, { createOrder } from "../../api/orderApi";
import { validateOffer } from "../../api/offerApi";
import type { ValidateOfferResponse } from "../../api/offerApi";

import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import CheckoutCustomerForm from "../../components/checkout/CheckoutCustomerForm";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";
import CheckoutEmptyCart from "../../components/checkout/CheckoutEmptyCart";
import DeliveryAddressForm from "../../components/checkout/DeliveryAddressForm";

import type {
  DeliveryAddress,
  DeliveryAddressErrors,
} from "../../components/checkout/DeliveryAddressForm";

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

interface PaymentInitiationResponse {
  success: boolean;
  message: string;
  data?: {
    paymentId: number;
    orderId: number;
    orderNumber: string;
    merchantOrderId: string;
    amount: number;
    currency: string;
    status: string;
    checkoutUrl: string;
  };
}

const INITIAL_DELIVERY_ADDRESS: DeliveryAddress = {
  addressLine1: "",
  addressLine2: "",
  area: "",
  city: "New Delhi",
  state: "Delhi",
  pincode: "",
  selectedZone: "WITHIN_DWARKA",
};

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      candidate.response?.data?.message ||
      candidate.message ||
      fallback
    );
  }

  return fallback;
}

function CheckoutPage() {
  const navigate = useNavigate();

  // CART
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const openCartDrawer = useCartStore((state) => state.openCartDrawer);

  const handleEditOrder = () => {
    if (!isSubmitting) {
      openCartDrawer();
    }
  };

  // AUTH
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  // CUSTOMER FORM
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });

  const [errors, setErrors] = useState<CheckoutErrors>({
    fullName: "",
    email: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * If order creation succeeds but payment initiation fails,
   * retain its ID so a retry can reuse the same order.
   */
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(
    null
  );

  // DELIVERY ADDRESS
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress>({ ...INITIAL_DELIVERY_ADDRESS });

  const [deliveryErrors, setDeliveryErrors] =
    useState<DeliveryAddressErrors>({});

  // COUPON
  const [couponCode, setCouponCode] = useState("");
  const [appliedOffer, setAppliedOffer] =
    useState<ValidateOfferResponse | null>(null);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const cartTotal = getCartTotal();
  const discountAmount = appliedOffer?.discountAmount ?? 0;
  const appliedCouponCode = appliedOffer?.offer.code ?? "";
  const finalAmount = Math.max(0, cartTotal - discountAmount);

  // AUTH GUARD
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/cart", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // SYNC USER DETAILS
  useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      phone: user.phone || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  // CUSTOMER INPUT
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

  // DELIVERY INPUT
  const handleDeliveryChange = (
    field: keyof DeliveryAddress,
    value: string
  ) => {
    setDeliveryAddress((current) => ({
      ...current,
      [field]: value,
    }));

    setDeliveryErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSubmitError("");
  };

  // COUPON INPUT
  const handleCouponCodeChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setCouponError("");
    setCouponMessage("");

    if (appliedOffer) {
      setAppliedOffer(null);
    }
  };

  // APPLY COUPON
  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (isApplyingCoupon || isSubmitting) return;

    if (!normalizedCode) {
      const message = "Please enter a coupon code.";
      setCouponError(message);
      setCouponMessage("");
      toast.error(message);
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      const message = "Your cart total is invalid.";
      setCouponError(message);
      setCouponMessage("");
      toast.error(message);
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");
    setCouponMessage("");

    try {
      const result = await validateOffer(normalizedCode, cartTotal);

      if (
        !result ||
        !result.offer ||
        !Number.isFinite(Number(result.discountAmount)) ||
        Number(result.discountAmount) < 0 ||
        Number(result.discountAmount) > cartTotal
      ) {
        throw new Error("The coupon response is invalid.");
      }

      const discount = Number(result.discountAmount);

      setAppliedOffer({
        ...result,
        discountAmount: discount,
        subtotal: Number(result.subtotal),
        totalAmount: Number(result.totalAmount),
      });

      setCouponCode(result.offer.code);

      const message = `Coupon applied! You save ₹${discount.toFixed(2)}.`;
      setCouponMessage(message);
      toast.success(message);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to validate this coupon. Please try again."
      );

      setAppliedOffer(null);
      setCouponError(message);
      setCouponMessage("");
      toast.error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // REMOVE COUPON
  const handleRemoveCoupon = () => {
    if (isSubmitting) return;

    setAppliedOffer(null);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");

    toast.success("Coupon removed successfully.");
  };

  // VALIDATE CUSTOMER
  const validateForm = () => {
    const newErrors: CheckoutErrors = {
      fullName: "",
      email: "",
    };

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (trimmedName.length < 2) {
      newErrors.fullName = "Name must contain at least 2 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.fullName = "Name cannot exceed 100 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    const firstError = newErrors.fullName || newErrors.email;

    if (firstError) {
      toast.error(firstError);
    }

    return !Object.values(newErrors).some(Boolean);
  };

  // VALIDATE DELIVERY ADDRESS
  const validateDeliveryAddress = () => {
    const newErrors: DeliveryAddressErrors = {};

    const addressLine1 = deliveryAddress.addressLine1.trim();
    const addressLine2 = deliveryAddress.addressLine2.trim();
    const area = deliveryAddress.area.trim();
    const city = deliveryAddress.city.trim();
    const state = deliveryAddress.state.trim();
    const pincode = deliveryAddress.pincode.trim();

    if (!addressLine1) {
      newErrors.addressLine1 =
        "Please enter your house/flat and street address.";
    } else if (addressLine1.length > 200) {
      newErrors.addressLine1 = "Address cannot exceed 200 characters.";
    }

    if (addressLine2.length > 200) {
      newErrors.addressLine2 = "Landmark cannot exceed 200 characters.";
    }

    if (!area) {
      newErrors.area = "Please enter your area or locality.";
    } else if (area.length > 100) {
      newErrors.area = "Area cannot exceed 100 characters.";
    }

    if (!city) {
      newErrors.city = "Please enter your city.";
    } else if (city.length > 100) {
      newErrors.city = "City cannot exceed 100 characters.";
    }

    if (!state) {
      newErrors.state = "Please enter your state.";
    } else if (state.length > 100) {
      newErrors.state = "State cannot exceed 100 characters.";
    }

    if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    if (
      deliveryAddress.selectedZone !== "WITHIN_DWARKA" &&
      deliveryAddress.selectedZone !== "OUTSIDE_DWARKA"
    ) {
      newErrors.selectedZone = "Please select a delivery area.";
    }

    setDeliveryErrors(newErrors);

    const firstError = Object.values(newErrors).find(Boolean);

    if (firstError) {
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  /*
   * INITIATE PHONEPE PAYMENT
   *
   * Uses the backend-calculated order total.
   * Never calculate or send a payment amount from the frontend.
   */
  const initiatePhonePePayment = async (orderId: number) => {
    const response = await api.post<PaymentInitiationResponse>(
      "/payments/initiate",
      { orderId }
    );

    const paymentData = response.data?.data;
    const checkoutUrl = paymentData?.checkoutUrl;

    if (
      !response.data?.success ||
      typeof checkoutUrl !== "string" ||
      !checkoutUrl.startsWith("https://")
    ) {
      throw new Error(
        "PhonePe did not return a valid checkout link. Please try again."
      );
    }

    /*
     * Save the order ID before redirecting so that the same
     * order can be reused if payment initiation needs a retry.
     */
    setPendingOrderId(orderId);

    window.location.assign(checkoutUrl);
  };

  // PLACE ORDER AND START PAYMENT
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting || isApplyingCoupon) return;

    if (!isAuthenticated || !user || !token) {
      toast.error("Please sign in to continue with your order.");
      navigate("/cart", { replace: true });
      return;
    }

    const isCustomerValid = validateForm();
    const isAddressValid = validateDeliveryAddress();

    if (!isCustomerValid || !isAddressValid) {
      const message =
        "Please correct the highlighted fields before continuing.";

      setSubmitError(message);
      return;
    }

    if (!items.length) {
      const message = "Your cart is empty.";
      setSubmitError(message);
      toast.error(message);
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      const message =
        "Your cart total is invalid. Please review your cart.";

      setSubmitError(message);
      toast.error(message);
      return;
    }

    const hasInvalidItem = items.some((item) => {
      const price = Number(item.variant.price);

      return (
        !item.product.name ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      );
    });

    if (hasInvalidItem) {
      const message =
        "One or more cart items have invalid details. Please review your cart.";

      setSubmitError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      let orderId = pendingOrderId;

      /*
       * Create the order only once during this checkout session.
       * A payment retry reuses the existing order ID.
       */
      if (orderId === null) {
        const createdOrder = await createOrder({
          customer: {
            name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
          },

          deliveryAddress: {
            addressLine1: deliveryAddress.addressLine1.trim(),
            addressLine2:
              deliveryAddress.addressLine2.trim() || null,
            area: deliveryAddress.area.trim(),
            city: deliveryAddress.city.trim(),
            state: deliveryAddress.state.trim(),
            pincode: deliveryAddress.pincode.trim(),

            /*
             * The backend determines the authoritative zone
             * from its configured PIN-code allowlist.
             */
            selectedZone: deliveryAddress.selectedZone,
          },

          items: items.map((item) => ({
            productId: Number(item.product.id),
            variantId: Number(item.variant.id),
            quantity: Number(item.quantity),
          })),

          offerCode: appliedCouponCode || null,
        });

        if (
          !createdOrder ||
          !Number.isSafeInteger(Number(createdOrder.id)) ||
          Number(createdOrder.id) <= 0
        ) {
          throw new Error(
            "The order was not created correctly. Please contact support before retrying."
          );
        }

        orderId = Number(createdOrder.id);
        setPendingOrderId(orderId);
      }

      /*
       * Initiate PhonePe using the database order ID.
       */
      try {
        await initiatePhonePePayment(orderId);
      } catch (paymentError: unknown) {
        const message = getErrorMessage(
          paymentError,
          "Unable to start PhonePe checkout."
        );

        /*
         * Keep pendingOrderId so another click retries payment
         * for the same order rather than creating a new order.
         */
        setSubmitError(
          `Your order has been created, but payment could not be started. Order ID: ${orderId}. ${message}`
        );

        toast.error(
          "Order created, but payment could not be started. You can retry from this page."
        );
      }
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to create your order. Please try again."
      );

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white text-[#2C2C2C]">
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-7 sm:px-6 sm:pb-24 sm:pt-9 lg:px-8 lg:pt-11">
        <div className="mb-7 sm:mb-9 lg:mb-10">
          <CheckoutHeader />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_370px] xl:gap-8"
        >
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-5">
            <section
              className="min-w-0 overflow-hidden rounded-xl border border-[#EEDFE2] bg-white shadow-sm"
              aria-label="Customer information"
            >
              <div className="p-5 sm:p-7 lg:p-8">
                <CheckoutCustomerForm
                  formData={formData}
                  errors={errors}
                  submitError=""
                  isSubmitting={isSubmitting}
                  phone={user.phone}
                  onChange={handleChange}
                />
              </div>
            </section>

            <DeliveryAddressForm
              value={deliveryAddress}
              errors={deliveryErrors}
              disabled={isSubmitting || isApplyingCoupon}
              onChange={handleDeliveryChange}
            />

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {submitError}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <aside
            className="min-w-0 lg:sticky lg:top-6"
            aria-label="Order summary"
          >
            <div className="overflow-hidden rounded-xl border border-[#EEDFE2] bg-white shadow-sm">
              <CheckoutOrderSummary
                items={items}
                cartTotal={cartTotal}
                isSubmitting={isSubmitting}
                onEditOrder={handleEditOrder}
                couponCode={couponCode}
                onCouponCodeChange={handleCouponCodeChange}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isApplyingCoupon={isApplyingCoupon}
                couponError={couponError}
                couponMessage={couponMessage}
                discountAmount={discountAmount}
                appliedCouponCode={appliedCouponCode}
              />

              {pendingOrderId !== null && (
                <div className="border-t border-[#EEDFE2] px-5 py-3 text-sm text-amber-800">
                  Order #{pendingOrderId} has been created. Retry
                  payment to continue with this order.
                </div>
              )}

              <div className="border-t border-[#EEDFE2] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    Payable amount (estimate)
                  </span>

                  <span className="text-lg font-semibold text-[#2C2C2C]">
                    ₹{finalAmount.toFixed(2)}
                  </span>
                </div>

                <p className="mb-4 text-xs leading-5 text-gray-500">
                  The final amount is calculated by the server using
                  current product prices and any valid offer. Delivery
                  details are confirmed according to our delivery policy.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || isApplyingCoupon}
                  className="flex w-full items-center justify-center rounded-lg bg-[#8B2942] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#722036] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Processing..."
                    : pendingOrderId !== null
                      ? "Retry PhonePe Payment"
                      : "Proceed to Pay"}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;