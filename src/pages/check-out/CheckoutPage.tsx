import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api, { createOrder } from "../../api/orderApi";
import { validateOffer, type ValidateOfferResponse } from "../../api/offerApi";

import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import CheckoutCustomerForm from "../../components/checkout/CheckoutCustomerForm";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";
import CheckoutEmptyCart from "../../components/checkout/CheckoutEmptyCart";
import DeliveryAddressForm, {
  type DeliveryAddress,
  type DeliveryAddressErrors,
} from "../../components/checkout/DeliveryAddressForm";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

// ─── Types ────────────────────────────────────────────────

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

interface SavedAddressResponse {
  success: boolean;
  hasSavedAddress: boolean;
  data: {
    addressLine1: string;
    addressLine2: string | null;
    area: string;
    city: string;
    state: string;
    pincode: string;
    selectedZone: DeliveryAddress["selectedZone"];
  } | null;
}

interface UpdateAddressResponse {
  success: boolean;
  message: string;
  data: SavedAddressResponse["data"];
}

// ─── Configuration ────────────────────────────────────────

const INITIAL_DELIVERY_ADDRESS: DeliveryAddress = {
  addressLine1: "",
  addressLine2: "",
  area: "",
  city: "New Delhi",
  state: "Delhi",
  pincode: "",
  selectedZone: "WITHIN_DWARKA",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^\d{6}$/;

// ─── Helpers ──────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
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

function validateCustomer(formData: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {
    fullName: "",
    email: "",
  };

  const name = formData.fullName.trim();
  const email = formData.email.trim();

  if (!name) {
    errors.fullName = "Please enter your full name.";
  } else if (name.length < 2) {
    errors.fullName = "Name must contain at least 2 characters.";
  } else if (name.length > 100) {
    errors.fullName = "Name cannot exceed 100 characters.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

function validateDelivery(addr: DeliveryAddress): DeliveryAddressErrors {
  const errors: DeliveryAddressErrors = {};

  const addr1 = addr.addressLine1.trim();
  const addr2 = addr.addressLine2.trim();
  const area = addr.area.trim();
  const city = addr.city.trim();
  const state = addr.state.trim();
  const pincode = addr.pincode.trim();

  if (!addr1) {
    errors.addressLine1 =
      "Please enter your house/flat and street address.";
  } else if (addr1.length > 200) {
    errors.addressLine1 = "Address cannot exceed 200 characters.";
  }

  if (addr2.length > 200) {
    errors.addressLine2 = "Landmark cannot exceed 200 characters.";
  }

  if (!area) {
    errors.area = "Please enter your area or locality.";
  } else if (area.length > 100) {
    errors.area = "Area cannot exceed 100 characters.";
  }

  if (!city) {
    errors.city = "Please enter your city.";
  } else if (city.length > 100) {
    errors.city = "City cannot exceed 100 characters.";
  }

  if (!state) {
    errors.state = "Please enter your state.";
  } else if (state.length > 100) {
    errors.state = "State cannot exceed 100 characters.";
  }

  if (!PINCODE_REGEX.test(pincode)) {
    errors.pincode = "Please enter a valid 6-digit PIN code.";
  }

  if (
    addr.selectedZone !== "WITHIN_DWARKA" &&
    addr.selectedZone !== "OUTSIDE_DWARKA"
  ) {
    errors.selectedZone = "Please select a delivery area.";
  }

  return errors;
}

function normalizeSavedAddress(
  address: NonNullable<SavedAddressResponse["data"]>
): DeliveryAddress {
  return {
    addressLine1: address.addressLine1 ?? "",
    addressLine2: address.addressLine2 ?? "",
    area: address.area ?? "",
    city: address.city || "New Delhi",
    state: address.state || "Delhi",
    pincode: address.pincode ?? "",
    selectedZone: address.selectedZone,
  };
}

// ─── Component ────────────────────────────────────────────

function CheckoutPage() {
  const navigate = useNavigate();

  // Stores
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const openCartDrawer = useCartStore((state) => state.openCartDrawer);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const hasValidSession = Boolean(
    isAuthenticated && user && token
  );

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });

  const [errors, setErrors] = useState<CheckoutErrors>({
    fullName: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the order ID so payment retries don't create duplicate orders.
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(
    null
  );

  // Delivery address
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress>({
      ...INITIAL_DELIVERY_ADDRESS,
    });

  const [deliveryErrors, setDeliveryErrors] =
    useState<DeliveryAddressErrors>({});

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const addressRequestId = useRef(0);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedOffer, setAppliedOffer] =
    useState<ValidateOfferResponse | null>(null);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Derived values
  const cartTotal = getCartTotal();
  const discountAmount = appliedOffer?.discountAmount ?? 0;
  const appliedCouponCode = appliedOffer?.offer.code ?? "";

  const isBusy =
    isSubmitting || isApplyingCoupon || isSavingAddress;

  // ─── Protect checkout route ─────────────────────────────

  useEffect(() => {
    if (hasValidSession) return;

    // Guests must authenticate from the cart drawer first.
    // Return to the home page and reopen the cart drawer.
    openCartDrawer();

    navigate("/", {
      replace: true,
    });

    toast.error("Please verify your phone number with OTP to checkout.");
  }, [hasValidSession, navigate, openCartDrawer]);

  // ─── Sync customer information after login ──────────────

  useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      phone: user.phone || current.phone || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  // ─── Load saved address for authenticated customers ──────

  useEffect(() => {
    const requestId = ++addressRequestId.current;
    let isActive = true;

    if (!hasValidSession) {
      setIsLoadingAddress(false);

      return () => {
        isActive = false;
      };
    }

    const loadSavedAddress = async () => {
      setIsLoadingAddress(true);

      try {
        const response =
          await api.get<SavedAddressResponse>("/users/me/address");

        if (!isActive || requestId !== addressRequestId.current) {
          return;
        }

        const result = response.data;

        if (
          !result?.success ||
          typeof result.hasSavedAddress !== "boolean"
        ) {
          throw new Error(
            "Unable to read the saved delivery address."
          );
        }

        if (result.hasSavedAddress && result.data) {
          setDeliveryAddress(normalizeSavedAddress(result.data));
        }
      } catch (error: unknown) {
        if (!isActive || requestId !== addressRequestId.current) {
          return;
        }

        // Customer can still enter an address manually.
        console.error(
          "Unable to load saved delivery address:",
          error
        );
      } finally {
        if (isActive && requestId === addressRequestId.current) {
          setIsLoadingAddress(false);
        }
      }
    };

    void loadSavedAddress();

    return () => {
      isActive = false;
    };
  }, [hasValidSession]);

  // ─── Handlers ───────────────────────────────────────────

  const handleEditOrder = () => {
    if (!isSubmitting) {
      openCartDrawer();

      navigate("/", {
        replace: false,
      });
    }
  };

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
  };

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
  };

  const handleCouponCodeChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setCouponError("");
    setCouponMessage("");

    if (appliedOffer) {
      setAppliedOffer(null);
    }
  };

  // ─── Save address for logged-in customers ────────────────

  const saveDeliveryAddress = async (
    address: DeliveryAddress
  ): Promise<boolean> => {
    if (!hasValidSession) {
      return false;
    }

    setIsSavingAddress(true);

    try {
      const response = await api.put<UpdateAddressResponse>(
        "/users/me/address",
        {
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2.trim() || "",
          area: address.area.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
          selectedZone: address.selectedZone,
        }
      );

      if (!response.data?.success || !response.data.data) {
        throw new Error(
          response.data?.message ||
            "Unable to save your delivery address."
        );
      }

      setDeliveryAddress(
        normalizeSavedAddress(response.data.data)
      );

      return true;
    } catch (error: unknown) {
      console.error("Unable to save delivery address:", error);

      toast.error(
        `Your order can continue, but the address could not be saved for future checkouts. ${getErrorMessage(
          error,
          "Please try again later."
        )}`
      );

      return false;
    } finally {
      setIsSavingAddress(false);
    }
  };

  // ─── Apply coupon ────────────────────────────────────────

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (isBusy) return;

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
      const result = await validateOffer(
        normalizedCode,
        cartTotal
      );

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

      const message = `Coupon applied! You save ₹${discount.toFixed(
        2
      )}.`;

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

  const handleRemoveCoupon = () => {
    if (isBusy) return;

    setAppliedOffer(null);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");

    toast.success("Coupon removed successfully.");
  };

  // ─── Initiate PhonePe payment ───────────────────────────

  const initiatePhonePePayment = async (
    orderId: number
  ): Promise<void> => {
    const response =
      await api.post<PaymentInitiationResponse>(
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

    // Keep the existing order ID for payment retries.
    setPendingOrderId(orderId);

    window.location.assign(checkoutUrl);
  };

  // ─── Validate fields and focus the first error ───────────

  const focusFirstInvalidField = () => {
    window.setTimeout(() => {
      const firstErrorElement = document.querySelector(
        '[aria-invalid="true"]'
      );

      if (!firstErrorElement) return;

      firstErrorElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (
        firstErrorElement instanceof HTMLInputElement ||
        firstErrorElement instanceof HTMLSelectElement ||
        firstErrorElement instanceof HTMLTextAreaElement
      ) {
        firstErrorElement.focus();
      }
    }, 100);
  };

  // ─── Submit checkout ────────────────────────────────────

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isBusy) return;

    // Defense-in-depth: guests must authenticate before checkout.
    if (!hasValidSession) {
      openCartDrawer();

      navigate("/", {
        replace: true,
      });

      toast.error(
        "Please verify your phone number with OTP to checkout."
      );

      return;
    }

    if (isLoadingAddress) {
      toast.error(
        "Please wait while we load your saved address."
      );

      return;
    }

    // Validate customer and delivery details.
    const customerErrors = validateCustomer(formData);
    const addressErrors = validateDelivery(deliveryAddress);

    setErrors(customerErrors);
    setDeliveryErrors(addressErrors);

    const hasCustomerErrors =
      Object.values(customerErrors).some(Boolean);

    const hasAddressErrors =
      Object.values(addressErrors).some(Boolean);

    if (hasCustomerErrors || hasAddressErrors) {
      toast.error("Please correct the highlighted fields.");
      focusFirstInvalidField();

      return;
    }

    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      toast.error(
        "Your cart total is invalid. Please review your cart."
      );

      return;
    }

    const hasInvalidItem = items.some((item) => {
      const price = Number(item.variant.price);
      const productId = Number(item.product.id);
      const variantId = Number(item.variant.id);

      return (
        !item.product.name ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isSafeInteger(variantId) ||
        variantId <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      );
    });

    if (hasInvalidItem) {
      toast.error(
        "One or more cart items have invalid details."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      let orderId = pendingOrderId;

      // Create the order only once.
      // If payment initiation fails, reuse this order ID on retry.
      if (orderId === null) {
        // Address saving is optional; an address-save failure
        // must not prevent a valid order from being created.
        await saveDeliveryAddress(deliveryAddress);

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
            "The order response was invalid. Check your orders before trying again."
          );
        }

        orderId = Number(createdOrder.id);
        setPendingOrderId(orderId);
      }

      // Reuse the order ID if payment initiation is retried.
      try {
        await initiatePhonePePayment(orderId);
      } catch (paymentError: unknown) {
        const message = getErrorMessage(
          paymentError,
          "Unable to start PhonePe checkout."
        );

        toast.error(
          `Order created, but payment could not be started. Order ID: ${orderId}. ${message}`
        );
      }
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to create your order. Please try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Protect rendering while redirecting ─────────────────

  // Avoid displaying the checkout form to unauthenticated guests.
  if (!hasValidSession) {
    return null;
  }

  // ─── Empty cart ──────────────────────────────────────────

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  // ─── Render ─────────────────────────────────────────────

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
          {/* Left column */}
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
                  phone={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </section>

            {isLoadingAddress && (
              <div
                className="rounded-lg border border-[#EEDFE2] bg-[#FFF9FA] px-4 py-3 text-sm text-[#79515A]"
                role="status"
              >
                Loading your saved delivery address...
              </div>
            )}

            <DeliveryAddressForm
              value={deliveryAddress}
              errors={deliveryErrors}
              disabled={
                isSubmitting ||
                isApplyingCoupon ||
                isLoadingAddress ||
                isSavingAddress
              }
              onChange={handleDeliveryChange}
            />
          </div>

          {/* Right column: order summary */}
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
                <div
                  className="border-t border-[#EEDFE2] px-5 py-3 text-sm text-amber-800"
                  role="status"
                >
                  Order #{pendingOrderId} has been created. Retry
                  payment to continue with this order.
                </div>
              )}

              <div className="p-5">
                <button
                  type="submit"
                  disabled={
                    isBusy ||
                    isLoadingAddress ||
                    items.length === 0
                  }
                  className="flex w-full items-center justify-center rounded-lg bg-[#B5697A] px-5 py-3 text-[12px] text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 md:text-[13px]"
                >
                  {isSubmitting
                    ? "Processing..."
                    : isSavingAddress
                      ? "Saving address..."
                      : isLoadingAddress
                        ? "Loading address..."
                        : pendingOrderId !== null
                          ? "Retry PhonePe Payment"
                          : "Proceed to Pay"}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  Secure checkout. Payment is processed through PhonePe.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;