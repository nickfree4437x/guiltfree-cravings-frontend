import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

import logo from "../../assets/logo.jpg";

function Navbar() {
  const navigate = useNavigate();

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

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
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
      if (
        event.key === "Escape"
      ) {
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

  const navLinks = [
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
    user?.name?.trim()?.charAt(0).toUpperCase() ||
    "A";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =========================================================
            MAIN NAVBAR
        ========================================================= */}

        <div className="flex h-[76px] items-center justify-between">

          {/* =========================================================
              LEFT — LOGO + BRAND
          ========================================================= */}

          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
            aria-label="GuiltFree Cravings Home"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:shadow-md">
              <img
                src={logo}
                alt="GuiltFree Cravings Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>

            <span className="hidden whitespace-nowrap text-[17px] font-bold tracking-[-0.02em] text-slate-900 sm:block">
              GuiltFree Cravings
            </span>
          </Link>

          {/* =========================================================
              CENTER — DESKTOP NAVIGATION
          ========================================================= */}

          <div className="hidden items-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/70 p-1">

              {navLinks.map(
                (link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={closeMenu}
                    className="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-white hover:text-[#8b542f] hover:shadow-sm xl:px-5"
                  >
                    {link.label}
                  </Link>
                )
              )}

            </div>
          </div>

          {/* =========================================================
              RIGHT — DESKTOP ACTIONS
          ========================================================= */}

          <div className="hidden items-center gap-3 lg:flex">

            {/* =======================================================
                CART
            ======================================================= */}

            <Link
              to="/cart"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-[#8b542f]/30 hover:bg-[#8b542f]/5 hover:text-[#8b542f]"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#8b542f] px-1 text-[9px] font-bold leading-none text-white shadow-sm">
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}
            </Link>

            {/* =======================================================
                ACCOUNT
            ======================================================= */}

            {isAuthenticated ? (
              <div
                ref={accountRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsAccountOpen(
                      (current) =>
                        !current
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:border-[#8b542f]/30 hover:bg-[#8b542f]/5 hover:text-[#8b542f]"
                  aria-haspopup="menu"
                  aria-expanded={
                    isAccountOpen
                  }
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b542f] text-xs font-bold text-white">
                    {userInitial}
                  </span>

                  <span className="max-w-[110px] truncate text-[13px] font-semibold">
                    {displayName}
                  </span>

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isAccountOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 7.5 5 5 5-5"
                    />
                  </svg>
                </button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                ================================================= */}

                {isAccountOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                    role="menu"
                  >

                    {/* Account Header */}

                    <div className="mb-1 rounded-xl bg-[#fffaf5] px-4 py-3">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {displayName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {user?.email ||
                          user?.phone ||
                          ""}
                      </p>
                    </div>

                    {/* Profile */}

                    <Link
                      to="/profile"
                      onClick={
                        closeAccount
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                      role="menuitem"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                          />
                        </svg>
                      </span>

                      <span>
                        My Profile
                      </span>
                    </Link>

                    {/* Orders */}

                    <Link
                      to="/orders"
                      onClick={
                        closeAccount
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                      role="menuitem"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"
                          />
                        </svg>
                      </span>

                      <span>
                        My Orders
                      </span>
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    {/* Logout */}

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      role="menuitem"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 17l5-5-5-5M15 12H3M21 4v16"
                          />
                        </svg>
                      </span>

                      <span>
                        Logout
                      </span>
                    </button>

                  </div>
                )}
              </div>
            ) : (
              /* =====================================================
                 LOGIN
              ===================================================== */

              <Link
                to="/login"
                className="rounded-full border border-[#8b542f]/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#8b542f] transition-all duration-200 hover:bg-[#8b542f]/5"
              >
                Login
              </Link>
            )}

            {/* =======================================================
                SHOP NOW
            ======================================================= */}

            <Link
              to="/#products"
              className="rounded-full bg-[#8b542f] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#754527] hover:shadow-md"
            >
              Shop Now
            </Link>

          </div>

          {/* =========================================================
              MOBILE ACTIONS
          ========================================================= */}

          <div className="flex items-center gap-2 lg:hidden">

            {/* Mobile Cart */}

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0L7 15h10l3-10H5.4ZM7 15l-1 2h12M9 20h.01M17 20h.01"
                />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#8b542f] px-1 text-[10px] font-bold leading-none text-white">
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(
                  (current) =>
                    !current
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label={
                isMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                isMenuOpen
              }
            >
              {isMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
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
                  className="h-5 w-5"
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

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}

        {isMenuOpen && (
          <div className="border-t border-slate-100 py-4 lg:hidden">

            {/* Navigation */}

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-2">

              {navLinks.map(
                (link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={
                      closeMenu
                    }
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-[#8b542f] hover:shadow-sm"
                  >
                    {link.label}
                  </Link>
                )
              )}

            </div>

            {/* =====================================================
                MOBILE ACCOUNT
            ===================================================== */}

            {isAuthenticated ? (
              <div className="mt-3 rounded-2xl border border-[#eadfd3] bg-white p-2">

                {/* Account identity */}

                <div className="flex items-center gap-3 rounded-xl bg-[#fffaf5] px-4 py-3">

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8b542f] text-sm font-bold text-white">
                    {userInitial}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email ||
                        user?.phone ||
                        ""}
                    </p>
                  </div>

                </div>

                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={
                    closeMenu
                  }
                  className="mt-2 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                >
                  <span>
                    My Profile
                  </span>

                  <span>
                    →
                  </span>
                </Link>

                {/* Orders */}

                <Link
                  to="/orders"
                  onClick={
                    closeMenu
                  }
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                >
                  <span>
                    My Orders
                  </span>

                  <span>
                    →
                  </span>
                </Link>

                {/* Logout */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="mt-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <span>
                    Logout
                  </span>

                  <span>
                    →
                  </span>
                </button>

              </div>
            ) : (
              /* =================================================
                 MOBILE LOGIN
              ================================================= */

              <Link
                to="/login"
                onClick={
                  closeMenu
                }
                className="mt-3 block rounded-full border border-[#8b542f]/30 bg-white px-5 py-3 text-center text-sm font-semibold text-[#8b542f] transition hover:bg-[#8b542f]/5"
              >
                Login
              </Link>
            )}

            {/* Mobile CTA */}

            <Link
              to="/#products"
              onClick={
                closeMenu
              }
              className="mt-3 block rounded-full bg-[#8b542f] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#754527]"
            >
              Shop Now
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;