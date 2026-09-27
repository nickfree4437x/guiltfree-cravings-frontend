import {
  House,
  Store,
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
      icon: House,
      isActive: isHomeActive,
      onClick: handleHome,
    },
    {
      label: "Products",
      icon: Store,
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
      <style>
        {`
          @keyframes badgePop {
            0%   { transform: scale(0); }
            60%  { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          @keyframes indicatorSlide {
            from { transform: translateX(-50%) scaleX(0.3); opacity: 0; }
            to   { transform: translateX(-50%) scaleX(1);   opacity: 1; }
          }
          .badge-pop { animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .indicator-slide { animation: indicatorSlide 0.3s cubic-bezier(0.22, 1, 0.36, 1); }

          button { -webkit-tap-highlight-color: transparent; }
        `}
      </style>

      <nav
        className="
          fixed bottom-0 left-0 right-0 z-[60] lg:hidden
          border-t border-[#EFE3D2] bg-white/95
          shadow-[0_-4px_20px_-8px_rgba(139,111,92,0.12)]
          backdrop-blur-md
        "
        aria-label="Mobile navigation"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="relative flex h-[60px] w-full items-stretch">

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

                {/* Icon */}
                <span className="relative flex items-center justify-center">
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.3 : 1.9}
                    className={`
                      relative z-10 transition-colors duration-300
                      ${
                        active
                          ? "text-[#B5697A]"
                          : "text-[#6B5B50] group-hover:text-[#B5697A]"
                      }
                    `}
                  />

                  {/* Cart badge */}
                  {tab.badge && tab.badge > 0 && (
                    <span
                      className="
                        badge-pop absolute -top-1.5 -right-2 z-20
                        flex h-[15px] min-w-[15px] items-center justify-center
                        rounded-full bg-[#B5697A] px-1
                        text-[9px] font-semibold leading-none text-white
                        ring-2 ring-white
                      "
                    >
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={`
                    relative z-10 text-[10px] leading-none
                    transition-colors duration-300
                    ${
                      active
                        ? "font-semibold text-[#B5697A]"
                        : "font-medium text-[#6B5B50] group-hover:text-[#B5697A]"
                    }
                  `}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* ================= DIVIDER ================= */}
          <span className="my-4 w-px self-center bg-[#EFE3D2]" />

          {/* ================= MORE BUTTON ================= */}
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
                className="relative z-10 text-[#6B5B50] transition-colors duration-300 group-hover:text-[#B5697A]"
              />
            </span>

            <span className="text-[10px] font-medium leading-none text-[#6B5B50] transition-colors duration-300 group-hover:text-[#B5697A]">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNavigation;