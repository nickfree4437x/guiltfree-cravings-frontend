import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  MoreHorizontal,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

interface MobileBottomNavigationProps {
  onMoreClick: () => void;
  cartCount?: number;
}

function MobileBottomNavigation({
  onMoreClick,
  cartCount = 0,
}: MobileBottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive =
    location.pathname === "/" && !location.hash;

  const isProductsActive =
    location.pathname === "/" && location.hash === "#products";

  const isCartActive =
    location.pathname.startsWith("/cart");

  const isProfileActive =
    location.pathname.startsWith("/account");

  const handleHome = () => navigate("/");
  const handleProducts = () => navigate("/#products");
  const handleCart = () => navigate("/cart");
  const handleProfile = () => navigate("/account");

  const tabs = [
    {
      label: "Home",
      icon: Home,
      isActive: isHomeActive,
      onClick: handleHome,
    },
    {
      label: "Products",
      icon: ShoppingBag,
      isActive: isProductsActive,
      onClick: handleProducts,
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      isActive: isCartActive,
      onClick: handleCart,
      badge: cartCount,
    },
    {
      label: "Profile",
      icon: User,
      isActive: isProfileActive,
      onClick: handleProfile,
    },
  ];

  return (
    <>
      {/* ================= GLOBAL STYLES ================= */}
      <style>
        {`
          @keyframes badgePop {
            0%   { transform: scale(0); }
            60%  { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          .badge-pop { animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

          button { -webkit-tap-highlight-color: transparent; }
        `}
      </style>

      {/* ================= NAV (edge-to-edge, bottom-fixed) ================= */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-[60]
          border-t border-slate-200
          bg-white
          shadow-[0_-4px_20px_rgba(15,23,42,0.08)]
          lg:hidden
        "
        aria-label="Mobile navigation"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* ================= TABS ROW ================= */}
        <div className="relative flex h-[62px] w-full items-stretch">

          {/* ==== TABS ==== */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.isActive;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.onClick}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className="
                  group relative flex min-w-0 flex-1 flex-col
                  items-center justify-center gap-1
                  transition-transform duration-200
                  active:scale-[0.94]
                "
              >

                {/* ==== ICON WRAPPER ==== */}
                <span className="relative flex items-center justify-center">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.4 : 1.8}
                    className={`
                      relative z-10 transition-colors duration-300
                      ${active ? "text-[#B5697A]" : "text-slate-400 group-hover:text-slate-600"}
                    `}
                  />

                  {/* ==== CART BADGE ==== */}
                  {tab.badge && tab.badge > 0 && (
                    <span
                      className="
                        badge-pop absolute -top-1.5 -right-2 z-20
                        flex h-[15px] min-w-[15px] items-center justify-center
                        rounded-full bg-[#B5697A] px-1
                        text-[9px] leading-none text-white
                        ring-2 ring-white
                      "
                    >
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </span>
                  )}
                </span>

                {/* ==== LABEL ==== */}
                <span
                  className={`
                    relative z-10 text-[10px] leading-none
                    transition-colors duration-300
                    ${active ? "text-[#B5697A]" : "text-slate-400"}
                  `}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* ==== DIVIDER (before More) ==== */}
          <span className="my-3 w-px self-center bg-slate-200" />

          {/* ==== MORE BUTTON ==== */}
          <button
            type="button"
            onClick={onMoreClick}
            aria-label="More options"
            className="
              group relative flex min-w-0 flex-1 flex-col
              items-center justify-center gap-1
              transition-transform duration-200
              active:scale-[0.94]
            "
          >
            <span className="relative flex items-center justify-center">
              <MoreHorizontal
                size={20}
                strokeWidth={1.9}
                className="relative z-10 text-slate-400 transition-colors duration-300 group-hover:text-slate-600"
              />
            </span>
            <span className="text-[10px] leading-none text-slate-400">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNavigation;