
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api, { createOrder } from "../../api/orderApi";
import {
  validateOffer,
  getPublicOffers,
  type Offer,
  type ValidateOfferResponse,
} from "../../api/offerApi";

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
import type { CartItem } from "../../store/cartStore";

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

type OfferSource = "AUTOMATIC" | "MANUAL";

interface AppliedOfferState {
  offer: ValidateOfferResponse;
  source: OfferSource;
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


// ─── Calculate item-wise offer discounts ───────────────────
// Distributes the already validated backend discount across eligible
// cart items. All calculations use paise to avoid floating-point drift.
function calculateItemDiscounts(
  items: CartItem[],
  appliedOffer: ValidateOfferResponse | null
): Record<string, number> {
  const discounts: Record<string, number> = {};

  if (!appliedOffer) return discounts;

  const totalDiscountCents = Math.max(
    0,
    Math.round(Number(appliedOffer.discountAmount) * 100)
  );

  if (totalDiscountCents === 0) return discounts;

  const rawVariantIds = (appliedOffer.offer as Offer).variantIds;
  const eligibleVariantIds = Array.isArray(rawVariantIds)
    ? rawVariantIds.map(Number).filter(Number.isFinite)
    : [];

  const eligibleItems = items
    .map((item) => {
      const subtotalCents = Math.max(
        0,
        Math.round(Number(item.variant.price) * Number(item.quantity) * 100)
      );

      return {
        item,
        key: `${item.product.id}-${item.variant.id}`,
        subtotalCents,
      };
    })
    .filter(({ item, subtotalCents }) => {
      const variantIsEligible =
        eligibleVariantIds.length === 0 ||
        eligibleVariantIds.includes(Number(item.variant.id));

      return variantIsEligible && subtotalCents > 0;
    });

  const eligibleSubtotalCents = eligibleItems.reduce(
    (sum, entry) => sum + entry.subtotalCents,
    0
  );

  const discountToDistribute = Math.min(
    totalDiscountCents,
    eligibleSubtotalCents
  );

  if (eligibleSubtotalCents === 0 || discountToDistribute === 0) {
    return discounts;
  }

  let distributedCents = 0;

  eligibleItems.forEach((entry, index) => {
    // Floor intermediate shares; give the exact remaining paise to the
    // final eligible item so the displayed item discounts equal the
    // validated overall discount exactly.
    const itemDiscountCents =
      index === eligibleItems.length - 1
        ? discountToDistribute - distributedCents
        : Math.floor(
            (discountToDistribute * entry.subtotalCents) /
              eligibleSubtotalCents
          );

    const safeDiscountCents = Math.min(
      entry.subtotalCents,
      Math.max(0, itemDiscountCents)
    );

    discounts[entry.key] = safeDiscountCents / 100;
    distributedCents += safeDiscountCents;
  });

  return discounts;
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

  const hasValidSession = Boolean(isAuthenticated && user && token);

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

  // Keep order ID for payment retries.
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
  const offerRequestId = useRef(0);

  // Coupon and offer state
  const [couponCode, setCouponCode] = useState("");
  const [appliedOfferState, setAppliedOfferState] =
    useState<AppliedOfferState | null>(null);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isLoadingPublicOffer, setIsLoadingPublicOffer] = useState(false);

  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Derived values
  const cartTotal = getCartTotal();

  const appliedOffer = appliedOfferState?.offer ?? null;
  const offerSource = appliedOfferState?.source ?? null;

  const discountAmount = appliedOffer
    ? Number(appliedOffer.discountAmount) || 0
    : 0;

  // Item-wise discount shares are used only for displaying checkout prices.
  // The backend remains responsible for the authoritative order/payment total.
  const itemDiscounts = useMemo(
    () => calculateItemDiscounts(items, appliedOffer),
    [items, appliedOffer]
  );

  const appliedCouponCode = appliedOffer?.offer.code ?? "";

  const isBusy =
    isSubmitting ||
    isApplyingCoupon ||
    isSavingAddress ||
    isLoadingPublicOffer;

  // Always send current cart variant IDs and quantities for validation.
  const getOfferCartItems = () =>
    items.map((item) => ({
      variantId: Number(item.variant.id),
      quantity: Number(item.quantity),
    }));

  // ─── Protect checkout route ─────────────────────────────

  useEffect(() => {
    if (hasValidSession) return;

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

  // ─── Load saved address ─────────────────────────────────

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

  // ─── Validate an offer ──────────────────────────────────

  const validateOfferForCart = async (code: string) => {
    const result = await validateOffer(
      code,
      cartTotal,
      getOfferCartItems()
    );

    if (
      !result ||
      !result.offer ||
      !Number.isFinite(Number(result.discountAmount)) ||
      Number(result.discountAmount) < 0 ||
      Number(result.discountAmount) > cartTotal
    ) {
      throw new Error("The offer response is invalid.");
    }

    return {
      ...result,
      discountAmount: Number(result.discountAmount),
      subtotal: Number(result.subtotal),
      totalAmount: Number(result.totalAmount),
    };
  };

  // ─── Automatically apply public offer ───────────────────

  useEffect(() => {
    const requestId = ++offerRequestId.current;
    let isActive = true;

    const applyPublicOffer = async () => {
      if (!hasValidSession || items.length === 0 || cartTotal <= 0) {
        setAppliedOfferState(null);
        setIsLoadingPublicOffer(false);
        return;
      }

      // Never override a coupon manually selected by the customer.
      if (appliedOfferState?.source === "MANUAL") {
        return;
      }

      setIsLoadingPublicOffer(true);

      try {
        const offers = await getPublicOffers();

        if (!isActive || requestId !== offerRequestId.current) {
          return;
        }

        const publicOffer = offers.find((offer: Offer) => {
          return (
            offer.audience === "PUBLIC" &&
            offer.isActive &&
            offer.discountType === "PERCENTAGE" &&
            Number(offer.discountValue) > 0 &&
            Number(offer.discountValue) <= 100 &&
            Boolean(offer.code)
          );
        });

        if (!publicOffer?.code) {
          setAppliedOfferState(null);
          setCouponCode("");
          setCouponMessage("");
          return;
        }

        const validatedOffer = await validateOfferForCart(
          publicOffer.code
        );

        if (!isActive || requestId !== offerRequestId.current) {
          return;
        }

        setAppliedOfferState({
          offer: validatedOffer,
          source: "AUTOMATIC",
        });

        setCouponCode(publicOffer.code);
        setCouponError("");

        setCouponMessage(
          validatedOffer.discountAmount > 0
            ? `Public offer applied! You save ₹${validatedOffer.discountAmount.toFixed(2)}.`
            : "Public offer is available for eligible products."
        );
      } catch (error: unknown) {
        if (!isActive || requestId !== offerRequestId.current) {
          return;
        }

        console.error("AUTOMATIC PUBLIC OFFER ERROR:", error);

        setAppliedOfferState(null);
        setCouponCode("");
        setCouponMessage("");
      } finally {
        if (isActive && requestId === offerRequestId.current) {
          setIsLoadingPublicOffer(false);
        }
      }
    };

    void applyPublicOffer();

    return () => {
      isActive = false;
    };
    // appliedOfferState intentionally excluded:
    // manual offers must not be overwritten by this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidSession, items, cartTotal]);

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

    if (appliedOfferState) {
      setAppliedOfferState(null);
    }
  };

  // ─── Save address ───────────────────────────────────────

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

  // ─── Apply manual coupon ────────────────────────────────

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
      const result = await validateOfferForCart(normalizedCode);

      setAppliedOfferState({
        offer: result,
        source: "MANUAL",
      });

      setCouponCode(result.offer.code);

      const message = `Coupon applied! You save ₹${result.discountAmount.toFixed(2)}.`;

      setCouponMessage(message);
      toast.success(message);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to validate this coupon. Please try again."
      );

      setAppliedOfferState(null);
      setCouponError(message);
      setCouponMessage("");

      toast.error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // ─── Remove offer ───────────────────────────────────────

  const handleRemoveCoupon = () => {
    if (isBusy) return;

    setAppliedOfferState(null);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");

    toast.success("Offer removed successfully.");
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

    setPendingOrderId(orderId);
    window.location.assign(checkoutUrl);
  };

  // ─── Focus first invalid field ──────────────────────────

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

    // Validate the selected offer again before order creation.
    let confirmedOfferCode: string | null = null;

    if (appliedOffer && appliedCouponCode) {
      try {
        const freshOffer = await validateOfferForCart(
          appliedCouponCode
        );

        setAppliedOfferState({
          offer: freshOffer,
          source: offerSource ?? "AUTOMATIC",
        });

        confirmedOfferCode = freshOffer.offer.code;
      } catch (error: unknown) {
        setAppliedOfferState(null);
        setCouponCode("");
        setCouponMessage("");

        toast.error(
          `Your offer is no longer valid. Please review your order and apply it again. ${getErrorMessage(
            error,
            ""
          )}`
        );

        return;
      }
    }

    setIsSubmitting(true);

    try {
      let orderId = pendingOrderId;

      // Create order only once.
      if (orderId === null) {
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
          offerCode: confirmedOfferCode,
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

      // Reuse existing order ID if payment initiation is retried.
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

  // ─── Protect rendering while redirecting ────────────────

  if (!hasValidSession) {
    return null;
  }

  // ─── Empty cart ─────────────────────────────────────────

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  // ─── Render ─────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-white text-[#2C2C2C]">
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mb-7 sm:mb-9 lg:mb-10">
          <CheckoutHeader />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_370px] xl:gap-8"
        >
          {/* Left Column */}
          <div className="min-w-0 space-y-5">
            {/* Delivery Information */}
            <div
              className="flex items-start gap-3 rounded-xl border border-[#EEDFE2] bg-[#FFF8FA] px-4 py-4 sm:px-5"
              role="note"
              aria-label="Important delivery information"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B5697A]/10 text-sm font-semibold text-[#B5697A]"
              >
                i
              </span>

              <div className="min-w-0">
                <p className="text-[12px] md:text-[13px] font-semibold text-[#79515A]">
                  Important Delivery Information
                </p>

                <p className="mt-1 text-[10px] leading-relxaed text-[#79515A]/90 sm:text-[12px]">
                  Please ensure your address, landmark, and phone number are
                  correct to avoid any delivery delays.
                </p>
              </div>
            </div>

            {/* Customer Information */}
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

          {/* Right Column: Order Summary */}
          <aside
            className="min-w-0 lg:sticky lg:top-6"
            aria-label="Order summary"
          >
            <div className="overflow-hidden rounded-xl border border-[#EEDFE2] bg-white shadow-sm">
              {isLoadingPublicOffer && (
                <div
                  className="border-b border-[#EEDFE2] bg-[#FFF9FA] px-5 py-3 text-xs text-[#79515A]"
                  role="status"
                >
                  Checking available offers...
                </div>
              )}

              {offerSource === "AUTOMATIC" && appliedOffer && (
                <div className="border-b border-[#DDECE2] bg-[#F3FAF5] px-5 py-3">
                  <p className="text-xs font-semibold text-[#28583B]">
                    🎉 Public offer automatically applied!
                  </p>
                  <p className="mt-1 text-[11px] text-[#52745C]">
                    You save ₹{discountAmount.toFixed(2)} on eligible products.
                  </p>
                </div>
              )}

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
                itemDiscounts={itemDiscounts}
              />

              {pendingOrderId !== null && (
                <div
                  className="border-t border-[#EEDFE2] px-5 py-3 text-[10px] md:text-[12px] text-amber-700"
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
                  className="flex w-full items-center justify-center rounded-lg bg-[#B5697A] hover:bg-[#965264] px-5 py-3 text-[12px] text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 md:text-[13px]"
                >
                  {isSubmitting
                    ? "Processing..."
                    : isSavingAddress
                      ? "Saving address..."
                      : isLoadingAddress
                        ? "Loading address..."
                        : isLoadingPublicOffer
                          ? "Checking offers..."
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
