import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { CSSProperties } from "react";

import { useNavigate } from "react-router-dom";

import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";

import NavbarLogo from "./NavbarLogo";
import DesktopNavigation from "./DesktopNavigation";
import DesktopActions from "./DesktopActions";
import MobileMenu from "./MobileMenu";
import MobileBottomNavigation from "./bottom-navbar/MobileBottomNavigation";

import type { NavLink } from "./DesktopNavigation";

interface NavbarProps {
  isHomePage: boolean;
}

/*
 * =========================================================
 * INSTAGRAM LINK
 * =========================================================
 */
const INSTAGRAM_URL = "#";

function Navbar({
  isHomePage: _isHomePage,
}: NavbarProps) {
  const navigate = useNavigate();

  /*
   * =========================================================
   * BRAND COLORS
   * =========================================================
   */

  const PRIMARY_COLOR = "#B5697A";

  /*
   * =========================================================
   * LOCAL UI STATE
   * =========================================================
   */

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isAccountOpen, setIsAccountOpen] =
    useState(false);

  /*
   * =========================================================
   * REFS
   * =========================================================
   */

  const accountRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * =========================================================
   * CART
   * =========================================================
   */

  const items = useCartStore(
    (state) => state.items
  );

  const cartItemCount = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  /*
   * =========================================================
   * CLOSE MOBILE MENU
   * =========================================================
   */

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /*
   * =========================================================
   * CLOSE ACCOUNT DROPDOWN
   * =========================================================
   */

  const closeAccount = () => {
    setIsAccountOpen(false);
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    logout();

    setIsAccountOpen(false);
    setIsMenuOpen(false);

    navigate("/");
  };

  /*
   * =========================================================
   * CLOSE ACCOUNT ON OUTSIDE CLICK
   * =========================================================
   */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target as Node
        )
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * =========================================================
   * CLOSE ACCOUNT WITH ESCAPE
   * =========================================================
   */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /*
   * =========================================================
   * NAVIGATION LINKS
   * =========================================================
   */

  const navLinks: NavLink[] = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Products",
      to: "/#products",
    },
    {
      label: "About Us",
      to: "/#about",
    },
    {
      label: "Why Choose",
      to: "/#why-choose",
    },
    {
      label: "Our Promise",
      to: "/#our-promise",
    },
  ];

  /*
   * =========================================================
   * USER DISPLAY
   * =========================================================
   */

  const displayName =
    user?.name?.trim() ||
    "My Account";

  const userInitial =
    user?.name
      ?.trim()
      ?.charAt(0)
      .toUpperCase() || "A";

  /*
   * =========================================================
   * NAVBAR VARIANT
   * =========================================================
   */

  const navbarVariant = "dark";

  /*
   * =========================================================
   * MOBILE MORE BUTTON
   * =========================================================
   */

  const handleMoreClick = () => {
    setIsMenuOpen(
      (current) => !current
    );
  };

  /*
   * =========================================================
   * INSTAGRAM ICON (SVG)
   * =========================================================
   */

  const InstagramIcon = ({
    className = "h-[18px] w-[18px]",
  }: {
    className?: string;
  }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
      />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line
        x1="17.5"
        y1="6.5"
        x2="17.51"
        y2="6.5"
      />
    </svg>
  );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <nav
        className="
          fixed
          left-0
          top-0
          z-40
          w-full
          border-b
          border-slate-100
          bg-white/95
          shadow-[0_4px_24px_rgba(0,0,0,0.06)]
          backdrop-blur-xl
        "
        style={
          {
            "--primary-color": PRIMARY_COLOR,
          } as CSSProperties
        }
      >
        {/* ===================================================
            NAVBAR CONTAINER
        =================================================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* =================================================
              MAIN NAVBAR
          ================================================= */}

          <div
            className="
              flex
              h-[60px]
              items-center
              justify-between
              gap-3
              sm:gap-4
              lg:h-[64px]
              lg:gap-6
            "
          >
            {/* =================================================
                LEFT — LOGO
            ================================================= */}

            <div className="shrink-0">
              <NavbarLogo
                onClick={closeMenu}
                variant={navbarVariant}
              />
            </div>

            {/* =================================================
                CENTER — DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden flex-1 justify-center lg:flex">
              <DesktopNavigation
                navLinks={navLinks}
                onNavigate={closeMenu}
                variant={navbarVariant}
              />
            </div>

            {/* =================================================
                RIGHT — DESKTOP ACTIONS + INSTAGRAM
            ================================================= */}

            <div
              ref={accountRef}
              className="hidden shrink-0 items-center gap-2 lg:flex"
            >
              {/* =============================================
                  DESKTOP INSTAGRAM LINK
              ============================================= */}

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="
                  group
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-slate-700
                  transition-all
                  duration-300
                  hover:border-transparent
                  hover:text-white
                  hover:shadow-sm
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-tr
                    from-[#F58529]
                    via-[#DD2A7B]
                    to-[#8134AF]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                <span className="relative z-10">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </span>
              </a>

              {/* =============================================
                  DESKTOP ACTIONS
              ============================================= */}

              <DesktopActions
                cartItemCount={cartItemCount}
                isAuthenticated={
                  isAuthenticated
                }
                user={user}
                displayName={displayName}
                userInitial={userInitial}
                isAccountOpen={
                  isAccountOpen
                }
                onAccountToggle={() =>
                  setIsAccountOpen(
                    (current) =>
                      !current
                  )
                }
                onAccountClose={
                  closeAccount
                }
                onLogout={handleLogout}
                variant={navbarVariant}
              />
            </div>

            {/* =================================================
                MOBILE TOP ACTIONS
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-1.5
                lg:hidden
              "
            >
              {/* =============================================
                  MOBILE INSTAGRAM LINK (compact)
              ============================================= */}

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="
                  group
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-slate-700
                  transition-all
                  duration-300
                  hover:border-transparent
                  hover:text-white
                  hover:shadow-sm
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-tr
                    from-[#F58529]
                    via-[#DD2A7B]
                    to-[#8134AF]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                <span className="relative z-10">
                  <InstagramIcon className="h-4 w-4" />
                </span>
              </a>

              {/* =============================================
                  MOBILE CART (compact)
              ============================================= */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-slate-800
                  transition-all
                  duration-200
                  hover:border-[#B5697A]/30
                  hover:text-[#B5697A]
                  active:scale-95
                "
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                  />
                </svg>

                {cartItemCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      min-h-[16px]
                      min-w-[16px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#B5697A]
                      px-1
                      text-[8px]
                      font-bold
                      leading-none
                      text-white
                      shadow-sm
                    "
                  >
                    {cartItemCount > 99
                      ? "99+"
                      : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SIDEBAR DRAWER
      ===================================================== */}

      <MobileMenu
        isOpen={isMenuOpen}
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        displayName={displayName}
        userInitial={userInitial}
        onClose={closeMenu}
        onLogout={handleLogout}
        variant={navbarVariant}
      />

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <MobileBottomNavigation
        onMoreClick={handleMoreClick}
      />
    </>
  );
}

export default Navbar;