import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import OtpAuthModal from "../../components/auth/OtpAuthModal";

import CartHeader from "../../components/cart/CartHeader";
import CartItemsList from "../../components/cart/CartItemsList";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import YouMayAlsoLike from "../../components/cart/YouMayAlsoLike";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

function CartPage() {
  const navigate = useNavigate();

  /* =========================================================
     AUTH MODAL STATE
  ========================================================= */

  const [
    isAuthModalOpen,
    setIsAuthModalOpen,
  ] = useState(false);

  /* =========================================================
     CART STORE
  ========================================================= */

  const items = useCartStore(
    (state) => state.items
  );

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const getCartTotal = useCartStore(
    (state) => state.getCartTotal
  );

  /* =========================================================
     AUTH STORE
  ========================================================= */

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  /* =========================================================
     CART TOTAL
  ========================================================= */

  const cartTotal = getCartTotal();

  /* =========================================================
     CART PRODUCT IDS
     ---------------------------------------------------------
     Used by "You May Also Like" so products already
     present in the cart aren't recommended again.
  ========================================================= */

  const cartProductIds = items.map(
    (item) => item.product.id
  );

  /* =========================================================
     PROCEED TO CHECKOUT
  ========================================================= */

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
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

    navigate("/checkout");
  };

  /* =========================================================
     AUTH MODAL CLOSE
  ========================================================= */

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (items.length === 0) {
    return <EmptyCart />;
  }

  /* =========================================================
     CART WITH ITEMS
  ========================================================= */

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ===================================================
            PAGE TOP SPACE
        ==================================================== */}

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-12">

          {/* =================================================
              PAGE HEADER
          ================================================== */}

          <div className="mb-8 sm:mb-10">
            <CartHeader />
          </div>

          {/* =================================================
              MAIN CART AREA
          ================================================== */}

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">

            {/* =================================================
                LEFT — CART ITEMS
            ================================================== */}

            <section className="min-w-0">
              <CartItemsList
                items={items}
                onUpdateQuantity={
                  updateQuantity
                }
                onRemove={
                  removeFromCart
                }
                onClearCart={
                  clearCart
                }
              />
            </section>

            {/* =================================================
                RIGHT — ORDER SUMMARY
            ================================================== */}

            <aside className="min-w-0 lg:sticky lg:top-24">
              <CartSummary
                cartTotal={cartTotal}
                onProceedToCheckout={
                  handleProceedToCheckout
                }
              />
            </aside>
          </div>

          {/* ==================================================
              YOU MAY ALSO LIKE
          =================================================== */}

          <section className="mt-6 border-t border-[#eadfd3] pt-4 sm:pt-6 lg:mt-8 lg:pt-8">
            <YouMayAlsoLike
              cartProductIds={
                cartProductIds
              }
            />
          </section>
        </div>
      </main>

      {/* =====================================================
          OTP AUTH MODAL
      ===================================================== */}

      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={
            handleAuthModalClose
          }
          onSuccess={
            handleAuthSuccess
          }
        />
      )}
    </>
  );
}

export default CartPage;