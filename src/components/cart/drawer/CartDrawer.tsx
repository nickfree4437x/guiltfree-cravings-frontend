import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { scrollToSection } from "../../../utils/smoothScroll";
import CartDrawerItem from "./CartDrawerItem";
import CartDrawerSummary from "./CartDrawerSummary";
import OtpAuthModal from "../../../components/auth/OtpAuthModal";

import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";

// ─── Constants ────────────────────────────────────────────
export type DeliveryZone = "within-dwarka" | "outside-dwarka";
export const FREE_DWARKA_THRESHOLD = 500;

// ─── Component ────────────────────────────────────────────
function CartDrawer() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [deliveryZone, setDeliveryZone] =
    useState<DeliveryZone>("within-dwarka");

  // Cart store
  const items = useCartStore((s) => s.items);
  const isCartDrawerOpen = useCartStore((s) => s.isCartDrawerOpen);
  const closeCartDrawer = useCartStore((s) => s.closeCartDrawer);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const getCartTotal = useCartStore((s) => s.getCartTotal);

  // Derived values
  const cartTotal = getCartTotal();

  const amountRemainingForFreeDelivery = Math.max(
    0,
    FREE_DWARKA_THRESHOLD - cartTotal
  );

  const hasFreeDwarkaDelivery = cartTotal >= FREE_DWARKA_THRESHOLD;

  const cartItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    if (!isCartDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartDrawerOpen]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCartDrawer();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  // ─── Handlers ───────────────────────────────────────────

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
      window.history.replaceState(null, "", "/#products");
    }, 150);
  };

  const handleProductClick = (productId: number) => {
    closeCartDrawer();

    window.setTimeout(() => {
      navigate(`/products/${productId}`);
    }, 150);
  };

  // ─── Checkout: Require OTP for guests ───────────────────

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Already authenticated: proceed directly.
    if (isAuthenticated) {
      closeCartDrawer();
      navigate("/checkout");
      return;
    }

    // Guest: keep the cart drawer open and request OTP verification.
    setIsAuthModalOpen(true);
  };

  // ─── OTP Success ────────────────────────────────────────

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);

    // OTP hook calls authStore.login() before onSuccess().
    // Navigate only after successful verification.
    closeCartDrawer();
    navigate("/checkout");
  };

  // ─── Render ─────────────────────────────────────────────

  return (
    <>
      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm"
              aria-hidden="true"
              onClick={closeCartDrawer}
            />

            {/* Cart Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.45,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="fixed right-0 top-0 z-[90] flex h-dvh w-full flex-col overflow-hidden bg-white shadow-2xl shadow-black/10 sm:max-w-[520px] md:max-w-[560px]"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Header */}
              <header className="flex min-h-[72px] shrink-0 items-center justify-between border-b border-[#E9E0D5] bg-white px-4 py-2 sm:px-5 md:px-6">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      <h2 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#28583B] sm:text-[17px]">
                        Your Laddoo Bag
                      </h2>

                      <span className="shrink-0 rounded-full bg-[#B5697A] px-2 py-1 text-[9px] leading-none text-white sm:px-2.5 sm:text-[10px]">
                        {cartItemCount}{" "}
                        {cartItemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCartDrawer}
                  aria-label="Close cart"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDF0F2] text-[#B5697A] transition-colors duration-200 hover:bg-[#F3DDE2] hover:text-[#9F5366] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/40 sm:h-9 sm:w-9"
                >
                  <X size={18} strokeWidth={1.7} />
                </button>
              </header>

              {items.length === 0 ? (
                /* Empty Cart */
                <div className="flex flex-1 flex-col items-center justify-center px-5 text-center sm:px-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8EDEF] text-[#B5697A]">
                    <ShoppingBag size={25} strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-5 text-[17px] font-semibold text-[#2C2C2C]">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-[270px] text-[12px] leading-5 text-slate-500">
                    Looks like you haven't added anything yet.
                  </p>

                  <button
                    type="button"
                    onClick={handleContinueShopping}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#B5697A] px-5 text-[12px] text-white transition hover:bg-[#A85D6F] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/25 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Delivery Zone */}
                  <section className="shrink-0 border-b border-[#F1E4C8] bg-white px-4 py-3 sm:px-5 sm:py-4 md:px-6">
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <span className="text-[12px] font-semibold text-[#28583B] sm:text-[14px]">
                        Delivery Zone:
                      </span>

                      <div className="flex w-full rounded-xl border border-[#DCD5CC] bg-white p-0.5 sm:w-auto">
                        {(
                          ["within-dwarka", "outside-dwarka"] as const
                        ).map((zone) => {
                          const isActive = deliveryZone === zone;

                          return (
                            <button
                              key={zone}
                              type="button"
                              onClick={() => setDeliveryZone(zone)}
                              aria-pressed={isActive}
                              className={`flex-1 rounded-lg px-3 py-2 text-[11px] transition-all sm:flex-none sm:px-3 sm:py-1.5 sm:text-[12px] ${
                                isActive
                                  ? "bg-[#B5697A] text-white shadow-sm"
                                  : "text-[#5E5148] hover:text-[#B5697A]"
                              }`}
                            >
                              {zone === "within-dwarka"
                                ? "Within Dwarka"
                                : "Outside Dwarka"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {deliveryZone === "within-dwarka" ? (
                      <p className="mt-2.5 text-[11px] leading-5 text-[#6F6259] sm:mt-3 sm:text-[12px]">
                        {hasFreeDwarkaDelivery ? (
                          <span className="text-[#28583B]">
                            🎉 Free Dwarka delivery!
                          </span>
                        ) : (
                          <>
                            Add{" "}
                            <span className="font-semibold text-[#2C2C2C]">
                              ₹{amountRemainingForFreeDelivery.toFixed(0)}
                            </span>{" "}
                            more to get{" "}
                            <span className="font-semibold text-[#2C2C2C]">
                              FREE Dwarka Delivery!
                            </span>
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="mt-2.5 max-w-[500px] text-[11px] leading-5 text-[#6F6259] sm:mt-2 sm:text-[12px]">
                        Dispatched via Porter. Customer pays{" "}
                        <span className="font-semibold text-[#2C2C2C]">
                          actual Porter delivery cost
                        </span>{" "}
                        directly without markup.
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-3">
                      <span className="text-[12px] text-[#934D12] sm:text-[13px]">
                        Expected Delivery:
                      </span>

                      <span className="shrink-0 text-[12px] text-[#28583B] sm:text-[13px]">
                        24–48 hrs
                      </span>
                    </div>
                  </section>

                  {/* Cart Items */}
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-3.5 sm:px-4 sm:py-4 md:px-5">
                    <div className="space-y-2.5 sm:space-y-3">
                      {items.map((item) => (
                        <CartDrawerItem
                          key={`${item.product.id}-${item.variant.id}`}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                          onProductClick={handleProductClick}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Add More */}
                  <div className="shrink-0 bg-white px-4 py-1 text-center sm:px-6">
                    <button
                      type="button"
                      onClick={handleContinueShopping}
                      className="group inline-flex w-full items-center justify-center gap-2 text-[11px] text-[#C9788B] transition-colors hover:underline sm:w-auto sm:justify-start sm:text-[12px]"
                    >
                      <span>Add More Laddoos</span>
                    </button>
                  </div>

                  {/* Summary */}
                  <CartDrawerSummary
                    cartTotal={cartTotal}
                    deliveryZone={deliveryZone}
                    onCheckout={handleCheckout}
                  />
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* OTP modal: shown only when a guest clicks Checkout */}
      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default CartDrawer;