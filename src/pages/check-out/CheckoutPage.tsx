
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { updateMyProfile } from "../../api/authApi";
import { createOrder } from "../../api/orderApi";
import {
  validateOffer,
} from "../../api/offerApi";
import type {
  ValidateOfferResponse,
} from "../../api/offerApi";

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

const INITIAL_DELIVERY_ADDRESS: DeliveryAddress = {
  addressLine1: "",
  addressLine2: "",
  area: "",
  city: "New Delhi",
  state: "Delhi",
  pincode: "",
  selectedZone: "WITHIN_DWARKA",
};

function CheckoutPage() {
  const navigate = useNavigate();

  // CART
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const openCartDrawer = useCartStore((state) => state.openCartDrawer);

  // Open the existing cart drawer without leaving checkout.
  const handleEditOrder = () => {
    openCartDrawer();
  };

  // AUTH
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

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
      phone: user.phone,
      email: current.email || user.email || "",
    }));
  }, [user]);

  // CUSTOMER INPUT
  const handleChange = (
    field: "fullName" | "email",
    value: string
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
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

    // An edited code must be applied again.
    if (appliedOffer) {
      setAppliedOffer(null);
    }
  };

  // APPLY COUPON
  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (isApplyingCoupon || isSubmitting) return;

    if (!normalizedCode) {
      setCouponError("Please enter a coupon code.");
      setCouponMessage("");
      return;
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      setCouponError("Your cart total is not valid.");
      setCouponMessage("");
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

      setAppliedOffer({
        ...result,
        discountAmount: Number(result.discountAmount),
        subtotal: Number(result.subtotal),
        totalAmount: Number(result.totalAmount),
      });

      setCouponCode(result.offer.code);
      setCouponMessage(
        `Coupon applied! You save ₹${Number(result.discountAmount).toFixed(2)}.`
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setAppliedOffer(null);
      setCouponError(
        err.response?.data?.message ||
          err.message ||
          "Unable to validate this coupon. Please try again."
      );
      setCouponMessage("");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // REMOVE COUPON
  const handleRemoveCoupon = () => {
    setAppliedOffer(null);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");
  };

  // VALIDATE CUSTOMER
  const validateForm = () => {
    const newErrors: CheckoutErrors = {
      fullName: "",
      email: "",
    };

    const trimmedName = formData.fullName.trim();

    if (!trimmedName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (trimmedName.length < 2) {
      newErrors.fullName = "Please enter a valid customer name.";
    } else if (trimmedName.length > 100) {
      newErrors.fullName = "Name cannot exceed 100 characters.";
    }

    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // VALIDATE DELIVERY ADDRESS
  const validateDeliveryAddress = () => {
    const newErrors: DeliveryAddressErrors = {};

    const addressLine1 = deliveryAddress.addressLine1.trim();
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

    if (!area) {
      newErrors.area = "Please enter your area or locality.";
    } else if (area.length > 100) {
      newErrors.area = "Area cannot exceed 100 characters.";
    }

    if (!city) newErrors.city = "Please enter your city.";
    if (!state) newErrors.state = "Please enter your state.";

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
    return Object.keys(newErrors).length === 0;
  };

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  // SUBMIT CHECKOUT
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting || isApplyingCoupon) return;

    if (!isAuthenticated || !user || !token) {
      navigate("/cart", { replace: true });
      return;
    }

    const isCustomerValid = validateForm();
    const isAddressValid = validateDeliveryAddress();

    if (!isCustomerValid || !isAddressValid) {
      setSubmitError(
        "Please correct the highlighted fields before continuing."
      );
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      // 1. SAVE CUSTOMER PROFILE
      const fullName = formData.fullName.trim();
      const email = formData.email.trim().toLowerCase();

      const updatedUser = await updateMyProfile(
        { name: fullName, email },
        token
      );

      updateUser(updatedUser);

      // 2. CUSTOMER SNAPSHOT
      const customer = {
        fullName: updatedUser.name ?? fullName,
        phone: updatedUser.phone,
        email: updatedUser.email ?? email,
      };

      // 3. ORDER ITEMS: server calculates actual prices
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      // 4. DELIVERY ADDRESS
      const addressPayload = {
        addressLine1: deliveryAddress.addressLine1.trim(),
        addressLine2: deliveryAddress.addressLine2.trim() || null,
        area: deliveryAddress.area.trim(),
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state.trim(),
        pincode: deliveryAddress.pincode.trim(),
      };

      // 5. CREATE ORDER
      // Backend must revalidate this coupon and calculate the final total.
      const createdOrder = await createOrder({
        customer: {
          name: customer.fullName,
          email: customer.email,
        },
        deliveryAddress: addressPayload,
        items: orderItems,
        offerCode: appliedOffer?.offer.code ?? null,
      });

      if (!createdOrder) {
        throw new Error("Order could not be created.");
      }

      // 6. PAYMENT NAVIGATION
      // Use the server-created order values, not frontend calculations.
      navigate("/payment", {
        state: {
          order: createdOrder,
          customer,
          offer: appliedOffer?.offer ?? null,
          discountAmount: Number(
            (createdOrder as typeof createdOrder & {
              discountAmount?: number;
            }).discountAmount ?? discountAmount
          ),
          subtotal: createdOrder.subtotal,
          finalAmount: createdOrder.totalAmount,
        },
      });
    } catch (error: unknown) {
      console.error("Checkout / order creation failed:", error);

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;
