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

/*
 * =========================================================
 * ANNOUNCEMENT BAR HEIGHT
 * =========================================================
 */
// const ANNOUNCEMENT_HEIGHT = 38;

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

  const [isAnnouncementVisible, setIsAnnouncementVisible] =
    useState(true);

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
   * ANNOUNCEMENT BAR SCROLL BEHAVIOUR
   * =========================================================
   *
   * At top:
   * Announcement bar is visible.
   *
   * On scroll:
   * Announcement bar collapses.
   *
   * Navbar naturally moves to top: 0.
   * =========================================================
   */

  useEffect(() => {
    const handleScroll = () => {
      setIsAnnouncementVisible(
        window.scrollY <= 8
      );
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
      label: "Reviews",
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
   * INSTAGRAM ICON
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
          FIXED HEADER WRAPPER
      ===================================================== */}

      <div
        className="
          fixed
          left-0
          top-0
          z-40
          w-full
        "
      >
        {/* ===================================================
            ANNOUNCEMENT BAR
        =================================================== */}

        <div
          className={`
            overflow-hidden
            bg-[#B5697A]
            text-white
            transition-all
            duration-300
            ease-out
            ${
              isAnnouncementVisible
                ? "max-h-[38px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              mx-auto
              flex
              h-[20px]
              md:h-[30px]
              w-full
              max-w-7xl
              items-center
              justify-between
              gap-4
              px-4
              sm:px-6
              lg:px-8
            "
          >
            {/* ===============================================
                LEFT — DELIVERY MESSAGE
            =============================================== */}

            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                justify-start
                gap-1.5
                overflow-hidden
                whitespace-nowrap
                text-ellipsis
                text-[10px]
                sm:text-[11px]
                lg:text-[12px]
              "
            >
              <span>
                Delivery in 24 – 48 hrs:
              </span>

              <span className="hidden sm:inline">
                Free Dwarka delivery on orders above ₹500
              </span>

              <span className="sm:hidden">
                Free Dwarka delivery above ₹500
              </span>

              <span className="hidden md:inline">
                •
              </span>

              <span className="hidden md:inline">
                Outside Dwarka via Porter (actuals)
              </span>
            </div>

            {/* ===============================================
                RIGHT — WHATSAPP + INSTAGRAM
            =============================================== */}

            <div
              className="
                hidden
                shrink-0
                items-center
                gap-4
                sm:flex
              "
            >
              {/* WhatsApp */}

              <a
                href="#"
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                  transition-opacity
                  duration-200
                  hover:opacity-80
                  text-[10px]
                sm:text-[11px]
                lg:text-[12px]
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.13 1.59 5.93L.07 24l6.35-1.66a11.87 11.87 0 0 0 5.63 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.42-8.41ZM12.06 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.86 9.86 0 0 1-1.51-5.27C2.15 6.44 6.59 2 12.05 2c2.65 0 5.14 1.03 7.02 2.91a9.87 9.87 0 0 1 2.91 7.03c0 5.46-4.44 9.9-9.92 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>

                <span>
                  Order on WhatsApp:
                </span>

                <span>
                  +91-9667760119
                </span>
                <span
                  className="
                    h-4
                    w-px
                    bg-white/30
                  "
                  aria-hidden="true"
                />
                <span>
                  FSSAI Lic :- #10823999000142
                </span>

              </a>

            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN NAVBAR
        =================================================== */}

        <nav
          className="
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
          {/* =================================================
              NAVBAR CONTAINER
          ================================================= */}

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
            {/* ===============================================
                MAIN NAVBAR
            =============================================== */}

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
              {/* =============================================
                  LEFT — LOGO
              ============================================= */}

              <div className="shrink-0">
                <NavbarLogo
                  onClick={closeMenu}
                  variant={navbarVariant}
                />
              </div>

              {/* =============================================
                  CENTER — DESKTOP NAVIGATION
              ============================================= */}

              <div className="hidden flex-1 justify-center lg:flex">
                <DesktopNavigation
                  navLinks={navLinks}
                  onNavigate={closeMenu}
                  variant={navbarVariant}
                />
              </div>

              {/* =============================================
                  RIGHT — DESKTOP ACTIONS + INSTAGRAM
              ============================================= */}

              <div
                ref={accountRef}
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-2
                  lg:flex
                "
              >
                {/* Desktop Instagram */}

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="
                    group
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-gradient-to-tr
                    from-[#F58529]
                    via-[#DD2A7B]
                    to-[#8134AF]
                    text-white
                    transition-all
                    duration-300
                    hover:border-[#B5697A]
                    hover:bg-[#B5697A]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <InstagramIcon className="h-[17px] w-[17px]" />
                </a>

                {/* Desktop Actions */}

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

              {/* =============================================
                  MOBILE TOP ACTIONS
              ============================================= */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  lg:hidden
                "
              >
                {/* Mobile Instagram */}

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="
                    group
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-gradient-to-tr
                    from-[#F58529]
                    via-[#DD2A7B]
                    to-[#8134AF]
                    text-white
                    transition-all
                    duration-300
                    hover:border-[#B5697A]
                    hover:bg-[#B5697A]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>

                {/* Mobile Cart */}

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
      </div>

      {/* =====================================================
          MOBILE SIDEBAR DRAWER
      ===================================================== */}

      <MobileMenu
        isOpen={isMenuOpen}
        navLinks={navLinks}
        user={user}
        displayName={displayName}
        userInitial={userInitial}
        onClose={closeMenu}
        onLogout={handleLogout}
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