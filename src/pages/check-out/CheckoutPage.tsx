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

// ─── Config ───────────────────────────────────────────────
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
      response?: { data?: { message?: string } };
      message?: string;
    };
    return candidate.response?.data?.message || candidate.message || fallback;
  }
  return fallback;
}

function validateCustomer(formData: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = { fullName: "", email: "" };
  const name = formData.fullName.trim();
  const email = formData.email.trim();

  if (!name) errors.fullName = "Please enter your full name.";
  else if (name.length < 2) errors.fullName = "Name must contain at least 2 characters.";
  else if (name.length > 100) errors.fullName = "Name cannot exceed 100 characters.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email address.";

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

  if (!addr1) errors.addressLine1 = "Please enter your house/flat and street address.";
  else if (addr1.length > 200) errors.addressLine1 = "Address cannot exceed 200 characters.";
  if (addr2.length > 200) errors.addressLine2 = "Landmark cannot exceed 200 characters.";
  if (!area) errors.area = "Please enter your area or locality.";
  else if (area.length > 100) errors.area = "Area cannot exceed 100 characters.";
  if (!city) errors.city = "Please enter your city.";
  else if (city.length > 100) errors.city = "City cannot exceed 100 characters.";
  if (!state) errors.state = "Please enter your state.";
  else if (state.length > 100) errors.state = "State cannot exceed 100 characters.";
  if (!PINCODE_REGEX.test(pincode)) errors.pincode = "Please enter a valid 6-digit PIN code.";
  if (addr.selectedZone !== "WITHIN_DWARKA" && addr.selectedZone !== "OUTSIDE_DWARKA") {
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
  const items = useCartStore((s) => s.items);
  const getCartTotal = useCartStore((s) => s.getCartTotal);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({ fullName: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

  // Delivery address
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ ...INITIAL_DELIVERY_ADDRESS });
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryAddressErrors>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const addressRequestId = useRef(0); // prevents stale address responses

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<ValidateOfferResponse | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Derived
  const cartTotal = getCartTotal();
  const discountAmount = appliedOffer?.discountAmount ?? 0;
  const appliedCouponCode = appliedOffer?.offer.code ?? "";

  // Shared disabled state
  const isBusy = isSubmitting || isApplyingCoupon || isSavingAddress;

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) navigate("/cart", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      phone: user.phone || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  // Load saved delivery address
  useEffect(() => {
    const requestId = ++addressRequestId.current;

    if (!isAuthenticated || !user || !token) {
      setIsLoadingAddress(false);
      return;
    }

    let isActive = true;

    const loadSavedAddress = async () => {
      setIsLoadingAddress(true);
      try {
        const response = await api.get<SavedAddressResponse>("/users/me/address");
        if (!isActive || requestId !== addressRequestId.current) return;

        const result = response.data;
        if (!result?.success || typeof result.hasSavedAddress !== "boolean") {
          throw new Error("Unable to read the saved delivery address.");
        }

        if (result.hasSavedAddress && result.data) {
          setDeliveryAddress(normalizeSavedAddress(result.data));
        }
      } catch (error: unknown) {
        if (!isActive || requestId !== addressRequestId.current) return;
        // Checkout remains usable even if the address API fails
        console.error("Unable to load saved delivery address:", error);
      } finally {
        if (isActive && requestId === addressRequestId.current) {
          setIsLoadingAddress(false);
        }
      }
    };

    void loadSavedAddress();
    return () => { isActive = false; };
  }, [isAuthenticated, user, token]);

  // ─── Handlers ───────────────────────────────────────────
  const handleEditOrder = () => {
    if (!isSubmitting) openCartDrawer();
  };

  const handleChange = (field: "fullName" | "email", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleDeliveryChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress((current) => ({ ...current, [field]: value }));
    setDeliveryErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleCouponCodeChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setCouponError("");
    setCouponMessage("");
    if (appliedOffer) setAppliedOffer(null);
  };

  // ─── Save address ───────────────────────────────────────
  const saveDeliveryAddress = async (address: DeliveryAddress): Promise<boolean> => {
    setIsSavingAddress(true);
    try {
      const response = await api.put<UpdateAddressResponse>("/users/me/address", {
        addressLine1: address.addressLine1.trim(),
        addressLine2: address.addressLine2.trim() || "",
        area: address.area.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
        selectedZone: address.selectedZone,
      });

      if (!response.data?.success || !response.data.data) {
        throw new Error(response.data?.message || "Unable to save your delivery address.");
      }

      setDeliveryAddress(normalizeSavedAddress(response.data.data));
      return true;
    } catch (error: unknown) {
      console.error("Unable to save delivery address:", error);
      toast.error(
        `Your order can still continue, but the address could not be saved for future checkouts. ${getErrorMessage(
          error,
          "Please try again later."
        )}`
      );
      return false;
    } finally {
      setIsSavingAddress(false);
    }
  };

  // ─── Apply coupon ───────────────────────────────────────
  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (isBusy) return;

    if (!normalizedCode) {
      const msg = "Please enter a coupon code.";
      setCouponError(msg);
      setCouponMessage("");
      toast.error(msg);
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      const msg = "Your cart total is invalid.";
      setCouponError(msg);
      setCouponMessage("");
      toast.error(msg);
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

      const msg = `Coupon applied! You save ₹${discount.toFixed(2)}.`;
      setCouponMessage(msg);
      toast.success(msg);
    } catch (error: unknown) {
      const msg = getErrorMessage(error, "Unable to validate this coupon. Please try again.");
      setAppliedOffer(null);
      setCouponError(msg);
      setCouponMessage("");
      toast.error(msg);
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

  // ─── Initiate PhonePe ───────────────────────────────────
  const initiatePhonePePayment = async (orderId: number) => {
    const response = await api.post<PaymentInitiationResponse>("/payments/initiate", { orderId });
    const paymentData = response.data?.data;
    const checkoutUrl = paymentData?.checkoutUrl;

    if (
      !response.data?.success ||
      typeof checkoutUrl !== "string" ||
      !checkoutUrl.startsWith("https://")
    ) {
      throw new Error("PhonePe did not return a valid checkout link. Please try again.");
    }

    setPendingOrderId(orderId);
    window.location.assign(checkoutUrl);
  };

  // ─── Submit order ───────────────────────────────────────
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!isAuthenticated || !user || !token) {
      toast.error("Please sign in to continue with your order.");
      navigate("/cart", { replace: true });
      return;
    }

    if (isLoadingAddress) {
      toast.error("Please wait while we load your saved address.");
      return;
    }

    // Validate customer + address
    const customerErrors = validateCustomer(formData);
    const addressErrors = validateDelivery(deliveryAddress);
    setErrors(customerErrors);
    setDeliveryErrors(addressErrors);

    const hasCustomerErr = Object.values(customerErrors).some(Boolean);
    const hasAddressErr = Object.values(addressErrors).some(Boolean);

    if (hasCustomerErr || hasAddressErr) {
      toast.error("Please correct the highlighted fields.");
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[aria-invalid="true"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          if (
            firstErrorElement instanceof HTMLInputElement ||
            firstErrorElement instanceof HTMLSelectElement ||
            firstErrorElement instanceof HTMLTextAreaElement
          ) {
            firstErrorElement.focus();
          }
        }
      }, 100);
      return;
    }

    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      toast.error("Your cart total is invalid. Please review your cart.");
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
      toast.error("One or more cart items have invalid details.");
      return;
    }

    setIsSubmitting(true);

    try {
      let orderId = pendingOrderId;

      // Create order only once — payment retry reuses existing ID
      if (orderId === null) {
        // Save address first (failure doesn't block order creation)
        await saveDeliveryAddress(deliveryAddress);

        const createdOrder = await createOrder({
          customer: {
            name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
          },
          deliveryAddress: {
            addressLine1: deliveryAddress.addressLine1.trim(),
            addressLine2: deliveryAddress.addressLine2.trim() || null,
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
            "The order was not created correctly. Please contact support before retrying."
          );
        }

        orderId = Number(createdOrder.id);
        setPendingOrderId(orderId);
      }

      // PhonePe payment
      try {
        await initiatePhonePePayment(orderId);
      } catch (paymentError: unknown) {
        const msg = getErrorMessage(paymentError, "Unable to start PhonePe checkout.");
        toast.error(`Order created, but payment failed. ID: ${orderId}. ${msg}`);
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error, "Unable to create your order. Please try again.");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Early returns ──────────────────────────────────────
  if (items.length === 0) return <CheckoutEmptyCart />;
  if (!isAuthenticated || !user) return null;

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
                  phone={user.phone}
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
              disabled={isSubmitting || isApplyingCoupon || isLoadingAddress || isSavingAddress}
              onChange={handleDeliveryChange}
            />
          </div>

          {/* Right column: order summary */}
          <aside className="min-w-0 lg:sticky lg:top-6" aria-label="Order summary">
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
                  Order #{pendingOrderId} has been created. Retry payment to continue with this order.
                </div>
              )}

              <div className="p-5">
                <button
                  type="submit"
                  disabled={isBusy || isLoadingAddress}
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
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;