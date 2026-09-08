import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  updateMyProfile,
} from "../../api/authApi";

import {
  validateOffer,
  type Offer,
  type ValidateOfferResponse,
} from "../../api/offerApi";

import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import CheckoutCustomerForm from "../../components/checkout/CheckoutCustomerForm";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";
import CheckoutEmptyCart from "../../components/checkout/CheckoutEmptyCart";

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

  /* =========================================================
     CART
  ========================================================= */

  const items = useCartStore(
    (state) => state.items
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  /* =========================================================
     AUTH
  ========================================================= */

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

  /* =========================================================
     STATE
  ========================================================= */

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

  /* =========================================================
     OFFER STATE
  ========================================================= */

  const [couponCode, setCouponCode] =
    useState("");

  const [appliedOffer, setAppliedOffer] =
    useState<ValidateOfferResponse | null>(null);

  const [isApplyingOffer, setIsApplyingOffer] =
    useState(false);

  const [offerError, setOfferError] =
    useState("");

  const cartTotal = getCartTotal();

  const discountAmount =
    appliedOffer?.discountAmount ?? 0;

  const finalAmount =
    appliedOffer?.totalAmount ?? cartTotal;

  /* =========================================================
     AUTH GUARD
  ========================================================= */

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

  /* =========================================================
     SYNC USER DETAILS
  ========================================================= */

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

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

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

  /* =========================================================
     APPLY OFFER
  ========================================================= */

  const handleApplyOffer = async () => {
    const code = couponCode.trim();

    if (!code) {
      setOfferError(
        "Please enter a coupon code."
      );

      return;
    }

    if (isApplyingOffer) {
      return;
    }

    if (appliedOffer) {
      return;
    }

    setOfferError("");
    setIsApplyingOffer(true);

    try {
      /*
       * Backend validates:
       *
       * - offer exists
       * - offer is active
       * - offer dates
       * - customer eligibility
       * - minimum order
       * - usage limits
       * - discount amount
       */

      const result = await validateOffer(
        code,
        cartTotal
      );

      setAppliedOffer(result);

      setCouponCode(result.offer.code);

      setOfferError("");
    } catch (error: any) {
      console.error(
        "Failed to apply offer:",
        error
      );

      const apiMessage =
        error?.response?.data?.message ||
        error?.message;

      setAppliedOffer(null);

      setOfferError(
        apiMessage ||
          "Unable to apply this offer. Please check the code and try again."
      );
    } finally {
      setIsApplyingOffer(false);
    }
  };

  /* =========================================================
     REMOVE OFFER
  ========================================================= */

  const handleRemoveOffer = () => {
    setAppliedOffer(null);
    setCouponCode("");
    setOfferError("");
  };

  /* =========================================================
     COUPON INPUT KEY DOWN
  ========================================================= */

  const handleCouponKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    handleApplyOffer();
  };

  /* =========================================================
     VALIDATE FORM
  ========================================================= */

  const validateForm = () => {
    const newErrors: CheckoutErrors = {
      fullName: "",
      email: "",
    };

    /* -------------------------------------------------------
       FULL NAME
    ------------------------------------------------------- */

    const trimmedName =
      formData.fullName.trim();

    if (!trimmedName) {
      newErrors.fullName =
        "Please enter your full name.";
    } else if (
      trimmedName.length < 2
    ) {
      newErrors.fullName =
        "Please enter a valid full name.";
    } else if (
      trimmedName.length > 100
    ) {
      newErrors.fullName =
        "Name cannot exceed 100 characters.";
    }

    /* -------------------------------------------------------
       EMAIL
    ------------------------------------------------------- */

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

  /* =========================================================
     SUBMIT CHECKOUT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /* -------------------------------------------------------
       PREVENT DUPLICATE SUBMISSION
    ------------------------------------------------------- */

    if (isSubmitting) {
      return;
    }

    /* -------------------------------------------------------
       AUTHENTICATION SAFETY CHECK
    ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       VALIDATE
    ------------------------------------------------------- */

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    /* -------------------------------------------------------
       CLEAR PREVIOUS API ERROR
    ------------------------------------------------------- */

    setSubmitError("");

    /* -------------------------------------------------------
       CLEAN CUSTOMER DATA
    ------------------------------------------------------- */

    const fullName =
      formData.fullName.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    /* -------------------------------------------------------
       START LOADING
    ------------------------------------------------------- */

    setIsSubmitting(true);

    try {
      /* =====================================================
         SAVE CUSTOMER PROFILE
      ===================================================== */

      const updatedUser =
        await updateMyProfile(
          {
            name: fullName,
            email,
          },
          token
        );

      /* =====================================================
         UPDATE AUTH STORE
      ===================================================== */

      updateUser(updatedUser);

      /* =====================================================
         CUSTOMER DATA FOR REVIEW PAGE
      ===================================================== */

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

      /* =====================================================
         GO TO REVIEW
      ===================================================== */

      navigate(
        "/checkout/review",
        {
          state: {
            customer,

            /*
             * Preserve the validated offer
             * for the review page.
             */
            offer: appliedOffer?.offer ?? null,

            discountAmount,

            subtotal: cartTotal,

            finalAmount,
          },
        }
      );
    } catch (error: any) {
      console.error(
        "Failed to update customer profile:",
        error
      );

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

  /* =========================================================
     NOT AUTHENTICATED
  ========================================================= */

  if (
    !isAuthenticated ||
    !user
  ) {
    return null;
  }

  /* =========================================================
     CHECKOUT UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-12">

        {/* ===================================================
            CHECKOUT HEADER
        =================================================== */}

        <div className="mb-8 sm:mb-10 lg:mb-12">
          <CheckoutHeader />
        </div>

        {/* ===================================================
            CHECKOUT CONTENT
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
        >

          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <section
            className="min-w-0"
            aria-label="Customer information"
          >
            <CheckoutCustomerForm
              formData={formData}
              errors={errors}
              submitError={submitError}
              isSubmitting={isSubmitting}
              phone={user.phone}
              onChange={handleChange}
            />
          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside
            className="min-w-0 lg:sticky lg:top-24"
            aria-label="Order summary"
          >

            <CheckoutOrderSummary
              items={items}
              cartTotal={cartTotal}
              isSubmitting={isSubmitting}
            />

          </aside>

        </form>

      </div>
    </main>
  );
}

export default CheckoutPage;