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
  createOrder,
} from "../../api/orderApi";

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

  const [appliedOffer] =
    useState<
      import("../../api/offerApi").ValidateOfferResponse | null
    >(null);

  const cartTotal =
    getCartTotal();

  const discountAmount =
    appliedOffer?.discountAmount ?? 0;

  // const finalAmount =
  //   appliedOffer?.totalAmount ?? cartTotal;

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

      phone:
        user.phone,

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
         1. SAVE CUSTOMER PROFILE
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
         2. UPDATE AUTH STORE
      ===================================================== */

      updateUser(updatedUser);

      /* =====================================================
         3. CUSTOMER DATA
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
         4. PREPARE ORDER ITEMS
      ===================================================== */

      const orderItems =
        items.map((item) => ({
          productId:
            item.product.id,

          variantId:
            item.variant.id,

          quantity:
            item.quantity,
        }));

      /* =====================================================
         5. CREATE ORDER
      ===================================================== */

      /*
       * IMPORTANT:
       *
       * The backend is responsible for:
       *
       * - validating products
       * - validating variants
       * - calculating prices
       * - calculating subtotal
       * - validating offers
       * - calculating discount
       * - calculating final amount
       * - creating the order
       *
       * Frontend does NOT send cartTotal/finalAmount
       * as the source of truth.
       */

      const createdOrder =
        await createOrder({
          customer: {
            name: fullName,
            email,
          },

          items:
            orderItems,

          /*
           * No offer is currently applied in this page.
           *
           * When the offer flow is connected, this can
           * be replaced with the actual offer code.
           */
          offerCode:
            null,
        });

      /* =====================================================
         6. SAFETY CHECK
      ===================================================== */

      if (!createdOrder) {
        throw new Error(
          "Order could not be created."
        );
      }

      /* =====================================================
         7. GO DIRECTLY TO PAYMENT
      ===================================================== */

      navigate(
        "/payment",
        {
          state: {
            /*
             * IMPORTANT:
             *
             * PaymentPage expects:
             *
             * location.state.order
             *
             * So we pass the backend-created order here.
             */

            order:
              createdOrder,

            customer,

            /*
             * Keep these values available for
             * any existing payment flow/state usage.
             */

            offer:
              appliedOffer?.offer ??
              null,

            discountAmount,

            subtotal:
              createdOrder.subtotal,

            finalAmount:
              createdOrder.totalAmount,
          },
        }
      );
    } catch (error: any) {
      console.error(
        "Checkout / order creation failed:",
        error
      );

      /* -----------------------------------------------------
         API ERROR
      ----------------------------------------------------- */

      const apiMessage =
        error?.response?.data?.message;

      setSubmitError(
        apiMessage ||
          error?.message ||
          "Unable to create your order. Please try again."
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
    <main
      className="
        min-h-screen
        bg-white
        text-[#2C2C2C]
      "
    >

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-6xl
          px-4
          pb-20
          pt-7
          sm:px-6
          sm:pb-24
          sm:pt-9
          lg:px-8
          lg:pt-11
        "
      >
        {/* ===================================================
            CHECKOUT HEADER
        =================================================== */}

        <div
          className="
            mb-7
            sm:mb-9
            lg:mb-10
          "
        >
          <CheckoutHeader />
        </div>

        {/* ===================================================
            MAIN CHECKOUT AREA
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            grid
            items-start
            gap-5
            lg:grid-cols-[minmax(0,1fr)_350px]
            lg:gap-7
            xl:grid-cols-[minmax(0,1fr)_370px]
            xl:gap-8
          "
        >
          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <section
            className="
              min-w-0
              overflow-hidden
              rounded-xl
              border
              border-[#EEDFE2]
              bg-white
              shadow-sm
            "
            aria-label="Customer information"
          >

            <div
              className="
                p-5
                sm:p-7
                lg:p-8
              "
            >
              <CheckoutCustomerForm
                formData={formData}
                errors={errors}
                submitError={submitError}
                isSubmitting={isSubmitting}
                phone={user.phone}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside
            className="
              min-w-0
              lg:sticky
              lg:top-6
            "
            aria-label="Order summary"
          >
            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-[#EEDFE2]
                bg-white
                shadow-sm
              "
            >

              <CheckoutOrderSummary
                items={items}
                cartTotal={cartTotal}
                isSubmitting={isSubmitting}
              />
            </div>
          </aside>
        </form>

      </div>
    </main>
  );
}

export default CheckoutPage;