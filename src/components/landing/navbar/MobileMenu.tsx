import { useState } from "react";
import { Link } from "react-router-dom";

import type { NavLink } from "./DesktopNavigation";

interface MobileMenuProps {
  isOpen: boolean;

  navLinks: NavLink[];

  isAuthenticated: boolean;

  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;

  displayName: string;
  userInitial: string;

  onClose: () => void;
  onLogout: () => void;

  variant?: "dark" | "light";
}

function MobileMenu({
  isOpen,
  navLinks,
  isAuthenticated,
  user,
  displayName,
  userInitial,
  onClose,
  onLogout,
  variant = "dark",
}: MobileMenuProps) {
  /*
   * =========================================================
   * BRAND COLOR
   * =========================================================
   */

  // const PRIMARY_COLOR = "#B5697A";

  /*
   * =========================================================
   * ACCOUNT MENU STATE
   * =========================================================
   */

  const [isAccountExpanded, setIsAccountExpanded] =
    useState(false);

  const isLight = variant === "light";

  /*
   * =========================================================
   * ACCOUNT TOGGLE
   * =========================================================
   */

  const handleAccountToggle = () => {
    setIsAccountExpanded(
      (current) => !current
    );
  };

  /*
   * =========================================================
   * CLOSE MENU
   * =========================================================
   */

  const handleClose = () => {
    setIsAccountExpanded(false);
    onClose();
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    setIsAccountExpanded(false);
    onLogout();
  };

  /*
   * =========================================================
   * HIDDEN
   * =========================================================
   */

  if (!isOpen) {
    return null;
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      className={`
        border-t
        py-3
        lg:hidden
        ${
          isLight
            ? "border-white/10 bg-black/10 backdrop-blur-xl"
            : "border-slate-100 bg-white"
        }
      `}
    >
      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <nav
        aria-label="Mobile navigation"
        className="space-y-1"
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={handleClose}
            className={`
              group
              flex
              items-center
              justify-between
              rounded-xl
              px-4
              py-3
              text-[13px]
              font-medium
              transition-all
              duration-200
              ${
                isLight
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-slate-700 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
              }
            `}
          >
            <span>{link.label}</span>

            <span
              className={`
                text-[15px]
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                ${
                  isLight
                    ? "text-white/40"
                    : "text-slate-300"
                }
              `}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ))}
      </nav>

      {/* =====================================================
          ACCOUNT SECTION
      ===================================================== */}

      {isAuthenticated ? (
        <div
          className={`
            mt-3
            overflow-hidden
            rounded-2xl
            border
            ${
              isLight
                ? "border-white/15 bg-white/5"
                : "border-[#B5697A]/15 bg-[#B5697A]/[0.035]"
            }
          `}
        >
          {/* =================================================
              ACCOUNT HEADER
          ================================================= */}

          <button
            type="button"
            onClick={handleAccountToggle}
            aria-expanded={isAccountExpanded}
            aria-controls="mobile-account-links"
            className={`
              flex
              w-full
              items-center
              justify-between
              px-4
              py-3
              text-left
              transition-all
              duration-200
              ${
                isLight
                  ? "hover:bg-white/10"
                  : "hover:bg-[#B5697A]/5"
              }
            `}
          >
            {/* USER INFO */}

            <div className="flex min-w-0 items-center gap-3">
              {/* Avatar */}

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#B5697A]
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-sm
                "
              >
                {userInitial}
              </span>

              {/* Details */}

              <div className="min-w-0">
                <p
                  className={`
                    truncate
                    text-[13px]
                    font-semibold
                    ${
                      isLight
                        ? "text-white"
                        : "text-slate-800"
                    }
                  `}
                >
                  {displayName}
                </p>

                <p
                  className={`
                    mt-0.5
                    truncate
                    text-[11px]
                    ${
                      isLight
                        ? "text-white/50"
                        : "text-slate-500"
                    }
                  `}
                >
                  {user?.email ||
                    user?.phone ||
                    ""}
                </p>
              </div>
            </div>

            {/* Chevron */}

            <span
              className={`
                ml-3
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                transition-all
                duration-200
                ${
                  isLight
                    ? "bg-white/10 text-white/60"
                    : "bg-white text-slate-400 shadow-sm"
                }
                ${
                  isAccountExpanded
                    ? "rotate-180"
                    : ""
                }
              `}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 7.5 5 5 5-5"
                />
              </svg>
            </span>
          </button>

          {/* =================================================
              ACCOUNT LINKS
          ================================================= */}

          <div
            id="mobile-account-links"
            className={`
              grid
              transition-all
              duration-200
              ease-in-out
              ${
                isAccountExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="min-h-0 overflow-hidden px-2 pb-2">
              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={handleClose}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-[12px]
                  font-medium
                  transition-all
                  ${
                    isLight
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      isLight
                        ? "bg-white/10 text-white/50"
                        : "bg-[#B5697A]/10 text-[#B5697A]"
                    }
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21a8 8 0 0 0-16 0"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    />
                  </svg>
                </span>

                My Profile
              </Link>

              {/* ORDERS */}

              <Link
                to="/orders"
                onClick={handleClose}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-[12px]
                  font-medium
                  transition-all
                  ${
                    isLight
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      isLight
                        ? "bg-white/10 text-white/50"
                        : "bg-[#B5697A]/10 text-[#B5697A]"
                    }
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 3h12v18H6z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 7h6M9 11h6M9 15h4"
                    />
                  </svg>
                </span>

                My Orders
              </Link>

              {/* WISHLIST */}

              <Link
                to="/wishlist"
                onClick={handleClose}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-[12px]
                  font-medium
                  transition-all
                  ${
                    isLight
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      isLight
                        ? "bg-white/10 text-white/50"
                        : "bg-[#B5697A]/10 text-[#B5697A]"
                    }
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 8.61a5.5 5.5 0 0 0-9.54-3.77L12 6l.7-1.16a5.5 5.5 0 0 0-9.54 3.77c0 3.62 3.45 6.32 8.84 10.39 5.39-4.07 8.84-6.77 8.84-10.39Z"
                    />
                  </svg>
                </span>

                Wishlist
              </Link>

              {/* COUPONS */}

              <Link
                to="/coupons"
                onClick={handleClose}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-[12px]
                  font-medium
                  transition-all
                  ${
                    isLight
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      isLight
                        ? "bg-white/10 text-white/50"
                        : "bg-[#B5697A]/10 text-[#B5697A]"
                    }
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 12a2 2 0 0 1-2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H8a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 2-2 2 2 0 0 1 2-2 2 2 0 0 0-2-2 2 2 0 0 1 2-2h8a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 2 2Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9h6M9 15h4"
                    />
                  </svg>
                </span>

                Coupons
              </Link>

              {/* DIVIDER */}

              <div
                className={`
                  my-1.5
                  border-t
                  ${
                    isLight
                      ? "border-white/10"
                      : "border-slate-100"
                  }
                `}
              />

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  text-[12px]
                  font-medium
                  text-red-500
                  transition-all
                  hover:bg-red-50
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-50
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 17l5-5-5-5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H3"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 19V5a2 2 0 0 0-2-2h-6"
                    />
                  </svg>
                </span>

                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================
           MOBILE LOGIN
        ===================================================== */

        <Link
          to="/login"
          onClick={handleClose}
          className="
            mt-3
            block
            rounded-xl
            bg-[#B5697A]
            px-5
            py-3
            text-center
            text-[13px]
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-[#a85f70]
            active:scale-[0.99]
          "
        >
          Login
        </Link>
      )}
    </div>
  );
}

export default MobileMenu;