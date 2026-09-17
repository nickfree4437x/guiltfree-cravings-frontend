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
   *
   * Navbar is always solid.
   * =========================================================
   */

  const navbarVariant = "dark";

  /*
   * =========================================================
   * MOBILE MORE BUTTON
   *
   * Opens the existing MobileMenu.
   * =========================================================
   */

  const handleMoreClick = () => {
    setIsMenuOpen(
      (current) => !current
    );
  };

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
              gap-6
              lg:h-[64px]
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
                RIGHT — DESKTOP ACTIONS
            ================================================= */}

            <div
              ref={accountRef}
              className="hidden shrink-0 lg:block"
            >
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
                gap-2
                lg:hidden
              "
            >
              {/* =============================================
                  MOBILE CART
              ============================================= */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="
                  relative
                  flex
                  h-10
                  w-10
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
                  className="h-[19px] w-[19px]"
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
                      min-h-[18px]
                      min-w-[18px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#B5697A]
                      px-1
                      text-[9px]
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

              {/* =============================================
                  MOBILE MENU BUTTON
              ============================================= */}

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  h-10
                  w-10
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
                aria-label={
                  isMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={
                  isMenuOpen
                }
                aria-controls="mobile-navigation"
              >
                {isMenuOpen ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-[19px] w-[19px]"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6l12 12M18 6L6 18"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-[19px] w-[19px]"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              EXISTING MOBILE MENU
          ================================================= */}

          <div id="mobile-navigation">
            <MobileMenu
              isOpen={isMenuOpen}
              navLinks={navLinks}
              isAuthenticated={
                isAuthenticated
              }
              user={user}
              displayName={displayName}
              userInitial={userInitial}
              onClose={closeMenu}
              onLogout={handleLogout}
              variant={navbarVariant}
            />
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION

          IMPORTANT:
          This is OUTSIDE the top <nav>.
          Therefore fixed bottom-0 is relative
          to the viewport, not the navbar.
      ===================================================== */}

      <MobileBottomNavigation
        onMoreClick={handleMoreClick}
      />
    </>
  );
}

export default Navbar;