import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";

import NavbarLogo from "./NavbarLogo";
import DesktopNavigation from "./DesktopNavigation";
import DesktopActions from "./DesktopActions";
import MobileMenu from "./MobileMenu";

import type { NavLink } from "./DesktopNavigation";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * =========================================================
   * LOCAL UI STATE
   * =========================================================
   */

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isAccountOpen, setIsAccountOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
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
   * HOME PAGE CHECK
   *
   * Transparent navbar is allowed ONLY on "/"
   * =========================================================
   */

  const isHomePage =
    location.pathname === "/";

  /*
   * =========================================================
   * SCROLL DETECTION
   *
   * Only relevant for the landing page.
   * =========================================================
   */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * =========================================================
   * RESET SCROLL STATE WHEN ROUTE CHANGES
   *
   * Every non-home route should start with a white navbar.
   * =========================================================
   */

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
    }
  }, [isHomePage]);

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
   * CLOSE ACCOUNT DROPDOWN ON OUTSIDE CLICK
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
   * CLOSE ACCOUNT DROPDOWN WITH ESCAPE
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
   * USER DISPLAY NAME
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
   * NAVBAR THEME
   *
   * HOME:
   *   Top     → transparent + white content
   *   Scroll  → white + dark content
   *
   * OTHER ROUTES:
   *   Always → white + dark content
   * =========================================================
   */

  const isTransparentNavbar =
    isHomePage && !isScrolled;

  const navbarVariant =
    isTransparentNavbar
      ? "light"
      : "dark";

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <nav
      className={`
        fixed
        left-0
        top-0
        z-50
        w-full
        transition-all
        duration-300
        ${
          isTransparentNavbar
            ? "bg-transparent"
            : "bg-white/95 shadow-sm backdrop-blur-md"
        }
      `}
    >
      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">

        {/* ===================================================
            MAIN NAVBAR
        =================================================== */}

        <div className="flex h-[68px] items-center justify-between">

          {/* =================================================
              LEFT — LOGO
          ================================================= */}

          <NavbarLogo
            onClick={closeMenu}
            variant={navbarVariant}
          />

          {/* =================================================
              CENTER — DESKTOP NAVIGATION
          ================================================= */}

          <DesktopNavigation
            navLinks={navLinks}
            onNavigate={closeMenu}
            variant={navbarVariant}
          />

          {/* =================================================
              RIGHT — DESKTOP ACTIONS
          ================================================= */}

          <div
            ref={accountRef}
            className="contents"
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
              MOBILE ACTIONS
          ================================================= */}

          <div className="flex items-center gap-1.5 lg:hidden">

            {/* =================================================
                MOBILE CART
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/cart")
              }
              className={`
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-300
                ${
                  isTransparentNavbar
                    ? "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }
              `}
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f5d6b3] px-1 text-[9px] font-bold leading-none text-[#2f2f2f]">
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}
            </button>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(
                  (current) =>
                    !current
                )
              }
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-300
                ${
                  isTransparentNavbar
                    ? "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }
              `}
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
                  className="h-[18px] w-[18px]"
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
                  className="h-[18px] w-[18px]"
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

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

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
  );
}

export default Navbar;