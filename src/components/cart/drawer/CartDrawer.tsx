import {
  useEffect,
  useState,
} from "react";

import {
  ShoppingBag,
  X,
} from "lucide-react";

import {
  scrollToSection,
} from "../../../utils/smoothScroll";

import { useNavigate } from "react-router-dom";

import OtpAuthModal from "../../auth/OtpAuthModal";

import CartDrawerItem from "./CartDrawerItem";
import CartDrawerSummary from "./CartDrawerSummary";

import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";

export type DeliveryZone =
  | "within-dwarka"
  | "outside-dwarka";

export const FREE_DWARKA_THRESHOLD = 500;

function CartDrawer() {
  const navigate = useNavigate();

  /* =========================================================
     AUTH MODAL
  ========================================================= */

  const [
    isAuthModalOpen,
    setIsAuthModalOpen,
  ] = useState(false);

  /* =========================================================
     DELIVERY ZONE
  ========================================================= */

  const [
    deliveryZone,
    setDeliveryZone,
  ] = useState<DeliveryZone>(
    "within-dwarka"
  );

  /* =========================================================
     CART STORE
  ========================================================= */

  const items = useCartStore(
    (state) => state.items
  );

  const isCartDrawerOpen = useCartStore(
    (state) => state.isCartDrawerOpen
  );

  const closeCartDrawer = useCartStore(
    (state) => state.closeCartDrawer
  );

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  /* =========================================================
     AUTH
  ========================================================= */

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  /* =========================================================
     TOTAL
  ========================================================= */

  const cartTotal = getCartTotal();

  const amountRemainingForFreeDelivery =
    Math.max(
      0,
      FREE_DWARKA_THRESHOLD - cartTotal
    );

  const hasFreeDwarkaDelivery =
    cartTotal >= FREE_DWARKA_THRESHOLD;

  /* =========================================================
     CART ITEM COUNT
  ========================================================= */

  const cartItemCount = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!isCartDrawerOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isCartDrawerOpen]);

  const handleContinueShopping = () => {
  closeCartDrawer();

  window.setTimeout(() => {
    if (window.location.pathname !== "/") {
      navigate("/#products");

      window.setTimeout(() => {
        scrollToSection("products");
      }, 100);
      return;
    }

    scrollToSection("products");

    window.history.replaceState(
      null,
      "",
      "/#products"
    );
  }, 150);
};

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    if (!isCartDrawerOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeCartDrawer();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isCartDrawerOpen,
    closeCartDrawer,
  ]);

  /* =========================================================
     CHECKOUT
  ========================================================= */

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    if (isAuthenticated) {
      closeCartDrawer();

      navigate("/checkout");

      return;
    }

    setIsAuthModalOpen(true);
  };

  /* =========================================================
     AUTH SUCCESS
  ========================================================= */

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);

    closeCartDrawer();

    navigate("/checkout");
  };

  /* =========================================================
     DO NOT RENDER CLOSED DRAWER
  ========================================================= */

  if (!isCartDrawerOpen) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-[80]
          bg-slate-950/45
          backdrop-blur-[2px]
        "
        aria-hidden="true"
        onClick={closeCartDrawer}
      />

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        className="
          fixed
          right-0
          top-0
          z-[90]

          flex
          h-dvh
          w-full

          flex-col
          overflow-hidden

          bg-white


          sm:max-w-[520px]
          md:max-w-[560px]
        "
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header
          className="
            flex
            min-h-[72px]
            shrink-0
            items-center
            justify-between

            border-b
            border-[#E9E0D5]

            bg-white

            px-4
            py-2

            sm:px-5
            md:px-6
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              sm:gap-3
            "
          >


            {/* TITLE */}

            <div className="min-w-0">
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-1.5

                  sm:gap-2
                "
              >
                <h2
                  className="
                    truncate
                    text-[15px]
                    font-semibold
                    tracking-[-0.02em]
                    text-[#28583B]

                    sm:text-[17px]
                  "
                >
                  Your Laddoo Bag
                </h2>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[#B5697A]
                    px-2
                    py-1
                    text-[9px]
                    leading-none
                    text-white

                    sm:px-2.5
                    sm:text-[10px]
                  "
                >
                  {cartItemCount}{" "}
                  {cartItemCount === 1
                    ? "item"
                    : "items"}
                </span>
              </div>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close cart"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#9A918A]

              transition

              bg-[#F8F2EC]
              hover:text-[#B5697A]

              focus:outline-none
              focus:ring-2
              focus:ring-[#B5697A]/20

              active:scale-95

              sm:h-9
              sm:w-9
            "
          >
            <X
              size={18}
              strokeWidth={1.7}
            />
          </button>
        </header>

        {/* ===================================================
            EMPTY CART
        ==================================================== */}

        {items.length === 0 ? (
          <div
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-center

              px-5
              text-center

              sm:px-6
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#F8EDEF]
                text-[#B5697A]
              "
            >
              <ShoppingBag
                size={25}
                strokeWidth={1.7}
              />
            </div>

            <h3
              className="
                mt-5
                text-[17px]
                font-semibold
                text-[#2C2C2C]
              "
            >
              Your cart is empty
            </h3>

            <p
              className="
                mt-2
                max-w-[270px]
                text-[12px]
                leading-5
                text-slate-500
              "
            >
              Looks like you haven't added
              anything yet.
            </p>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="
                mt-4
                inline-flex
                h-10
                items-center
                justify-center
                rounded-lg
                bg-[#B5697A]
                px-5
                text-[12px]
                text-white

                transition

                hover:bg-[#A85D6F]

                focus:outline-none
                focus:ring-2
                focus:ring-[#B5697A]/25
                focus:ring-offset-2

                active:scale-[0.98]
              "
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* =================================================
                DELIVERY ZONE
            ================================================== */}

            <section
              className="
                shrink-0

                border-b
                border-[#F1E4C8]

                bg-[#FFFCF7]

                px-4
                py-3

                sm:px-5
                sm:py-4

                md:px-6
              "
            >
              {/* =================================================
                  DELIVERY HEADER
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-2.5

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-3
                "
              >
                <span
                  className="
                    text-[12px]
                    font-semibold
                    text-[#28583B]

                    sm:text-[14px]
                  "
                >
                  Delivery Zone:
                </span>

                {/* =================================================
                    ZONE SWITCH
                ================================================== */}

                <div
                  className="
                    flex
                    w-full
                    rounded-xl
                    border
                    border-[#DCD5CC]
                    bg-white
                    p-0.5

                    sm:w-auto
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryZone(
                        "within-dwarka"
                      )
                    }
                    className={`
                      flex-1
                      rounded-lg
                      px-3
                      py-2
                      text-[11px]
                      transition-all

                      sm:flex-none
                      sm:px-3
                      sm:py-1.5
                      sm:text-[12px]

                      ${
                        deliveryZone ===
                        "within-dwarka"
                          ? "bg-[#B5697A] text-white shadow-sm"
                          : "text-[#5E5148] hover:text-[#B5697A]"
                      }
                    `}
                  >
                    Within Dwarka
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryZone(
                        "outside-dwarka"
                      )
                    }
                    className={`
                      flex-1
                      rounded-lg
                      px-3
                      py-2
                      text-[11px]
                      transition-all

                      sm:flex-none
                      sm:px-3
                      sm:py-1.5
                      sm:text-[12px]

                      ${
                        deliveryZone ===
                        "outside-dwarka"
                          ? "bg-[#B5697A] text-white shadow-sm"
                          : "text-[#5E5148] hover:text-[#B5697A]"
                      }
                    `}
                  >
                    Outside Dwarka
                  </button>
                </div>
              </div>

              {/* =================================================
                  DELIVERY MESSAGE
              ================================================== */}

              {deliveryZone ===
              "within-dwarka" ? (
                <p
                  className="
                    mt-2.5
                    text-[11px]
                    leading-5
                    text-[#6F6259]

                    sm:mt-3
                    sm:text-[12px]
                  "
                >
                  {hasFreeDwarkaDelivery ? (
                    <span className=" text-[#28583B]">
                      🎉 Free Dwarka delivery!
                    </span>
                  ) : (
                    <>
                      Add{" "}
                      <span
                        className="
                          font-semibold
                          text-[#2C2C2C]
                        "
                      >
                        ₹
                        {amountRemainingForFreeDelivery.toFixed(
                          0
                        )}
                      </span>{" "}
                      more to get{" "}
                      <span
                        className="
                          font-semibold
                          text-[#2C2C2C]
                        "
                      >
                        FREE Dwarka Delivery!
                      </span>
                    </>
                  )}
                </p>
              ) : (
                <p
                  className="
                    mt-2.5
                    max-w-[500px]
                    text-[11px]
                    leading-5
                    text-[#6F6259]

                    sm:mt-2
                    sm:text-[12px]
                  "
                >
                  Dispatched via Porter.
                  Customer pays{" "}
                  <span
                    className="
                      font-semibold
                      text-[#2C2C2C]
                    "
                  >
                    actual Porter delivery
                    cost
                  </span>{" "}
                  directly without markup.
                </p>
              )}

              {/* =================================================
                  EXPECTED DELIVERY
              ================================================== */}

              <div
                className="
                  mt-2.5
                  flex
                  items-center
                  justify-between
                  gap-3

                  sm:mt-3
                "
              >
                <span
                  className="
                    text-[12px]
                    text-[#934D12]

                    sm:text-[13px]
                  "
                >
                  Expected Delivery:
                </span>

                <span
                  className="
                    shrink-0
                    text-[12px]
                    text-[#28583B]

                    sm:text-[13px]
                  "
                >
                  24–48 hrs
                </span>
              </div>
            </section>

            {/* =================================================
                CART ITEMS
            ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto

                overscroll-contain

                px-3.5
                py-3.5

                sm:px-4
                sm:py-4

                md:px-5
              "
            >
              <div className="space-y-2.5 sm:space-y-3">
                {items.map((item) => (
                  <CartDrawerItem
                    key={`${item.product.id}-${item.variant.id}`}
                    item={item}
                    onUpdateQuantity={
                      updateQuantity
                    }
                    onRemove={
                      removeFromCart
                    }
                  />
                ))}
              </div>
            </div>

            {/* =================================================
                SUMMARY
            ================================================== */}

            <CartDrawerSummary
              cartTotal={cartTotal}
              deliveryZone={deliveryZone}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </aside>

      {/* =====================================================
          OTP AUTH MODAL
      ===================================================== */}

      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() =>
            setIsAuthModalOpen(false)
          }
          onSuccess={
            handleAuthSuccess
          }
        />
      )}
    </>
  );
}

export default CartDrawer;