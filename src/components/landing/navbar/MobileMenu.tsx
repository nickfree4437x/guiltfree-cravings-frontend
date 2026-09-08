import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

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

  variant?: "dark" | "light"; // New prop
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
  variant = "dark", // Default dark
}: MobileMenuProps) {

  /*
   * =========================================================
   * ACCOUNT MENU STATE
   * =========================================================
   */

  const [
    isAccountExpanded,
    setIsAccountExpanded,
  ] = useState(false);

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

  return (
    <div
      className={`
        border-t py-2 lg:hidden
        ${isLight 
          ? "border-white/10 bg-white/5 backdrop-blur-md" 
          : "border-slate-100"
        }
      `}
    >

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <div>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={handleClose}
            className={`
              block rounded-xl px-4 py-1.5 text-[12px] transition
              ${isLight 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-700 hover:text-[#8b542f] hover:bg-white"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* =====================================================
          MOBILE ACCOUNT
      ===================================================== */}

      {isAuthenticated ? (

        <div
          className={`
            mt-1 rounded-md border p-0
            ${isLight 
              ? "border-white/20 bg-white/10 backdrop-blur-sm" 
              : "border-[#eadfd3] bg-white"
            }
          `}
        >

          {/* =================================================
              ACCOUNT HEADER / TOGGLE
          ================================================= */}

          <button
            type="button"
            onClick={handleAccountToggle}
            aria-expanded={isAccountExpanded}
            aria-controls="mobile-account-links"
            className={`
              flex w-full items-center justify-between rounded-xl px-4 py-2 text-left transition
              ${isLight 
                ? "bg-white/5 hover:bg-white/15" 
                : "bg-[#fffaf5] hover:bg-[#fdf4eb]"
              }
            `}
          >

            {/* User */}

            <div className="flex min-w-0 items-center gap-3">

              {/* Avatar */}

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b542f] text-[12px] font-semibold text-white">
                {userInitial}
              </span>

              {/* User Details */}

              <div className="min-w-0">

                <p className={`
                  truncate text-sm font-semibold
                  ${isLight ? "text-white" : "text-[#2f2f2f]"}
                `}>
                  {displayName}
                </p>

                <p className={`
                  truncate text-[11px] font-light
                  ${isLight ? "text-white/60" : "text-slate-500"}
                `}>
                  {user?.email ||
                    user?.phone ||
                    ""}
                </p>

              </div>

            </div>

            {/* Expand / Collapse Icon */}

            <span
              className={`
                ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200
                ${isLight 
                  ? "bg-white/10 text-white/60" 
                  : "bg-white text-slate-500"
                }
                ${isAccountExpanded ? "rotate-180" : ""}
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
            className={`grid transition-all duration-200 ease-in-out ${
              isAccountExpanded
                ? "mt-1 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >

            <div className="min-h-0 overflow-hidden">

              {/* =================================================
                  PROFILE
              ================================================= */}

              <Link
                to="/profile"
                onClick={handleClose}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-2.5 text-[12px] transition
                  ${isLight 
                    ? "text-white/70 hover:text-white hover:bg-white/10" 
                    : "text-slate-700 hover:text-[#8b542f] hover:bg-[#fffaf5]"
                  }
                `}
              >

                <span className="flex items-center gap-3">

                  <span className={`
                    flex h-6 w-6 items-center justify-center rounded-lg
                    ${isLight 
                      ? "bg-white/10 text-white/50" 
                      : "bg-slate-100 text-slate-500"
                    }
                  `}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-3 w-3"
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

                  <span>
                    My Profile
                  </span>

                </span>
              </Link>

              {/* =================================================
                  ORDERS
              ================================================= */}

              <Link
                to="/orders"
                onClick={handleClose}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-2.5 text-[12px] transition
                  ${isLight 
                    ? "text-white/70 hover:text-white hover:bg-white/10" 
                    : "text-slate-700 hover:text-[#8b542f] hover:bg-[#fffaf5]"
                  }
                `}
              >

                <span className="flex items-center gap-3">

                  <span className={`
                    flex h-6 w-6 items-center justify-center rounded-lg
                    ${isLight 
                      ? "bg-white/10 text-white/50" 
                      : "bg-slate-100 text-slate-500"
                    }
                  `}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-3 w-3"
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

                  <span>
                    My Orders
                  </span>

                </span>
              </Link>

              {/* =================================================
                  WISHLIST
              ================================================= */}

              <Link
                to="/wishlist"
                onClick={handleClose}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-2.5 text-[12px] transition
                  ${isLight 
                    ? "text-white/70 hover:text-white hover:bg-white/10" 
                    : "text-slate-700 hover:text-[#8b542f] hover:bg-[#fffaf5]"
                  }
                `}
              >

                <span className="flex items-center gap-3">

                  <span className={`
                    flex h-6 w-6 items-center justify-center rounded-lg
                    ${isLight 
                      ? "bg-white/10 text-white/50" 
                      : "bg-slate-100 text-slate-500"
                    }
                  `}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 8.61a5.5 5.5 0 0 0-9.54-3.77L12 6l.7-1.16a5.5 5.5 0 0 0-9.54 3.77c0 3.62 3.45 6.32 8.84 10.39 5.39-4.07 8.84-6.77 8.84-10.39Z"
                      />
                    </svg>
                  </span>

                  <span>
                    Wishlist
                  </span>

                </span>
              </Link>

              {/* =================================================
                  COUPONS
              ================================================= */}

              <Link
                to="/coupons"
                onClick={handleClose}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-2.5 text-[12px] transition
                  ${isLight 
                    ? "text-white/70 hover:text-white hover:bg-white/10" 
                    : "text-slate-700 hover:text-[#8b542f] hover:bg-[#fffaf5]"
                  }
                `}
              >

                <span className="flex items-center gap-3">

                  <span className={`
                    flex h-6 w-6 items-center justify-center rounded-lg
                    ${isLight 
                      ? "bg-white/10 text-white/50" 
                      : "bg-slate-100 text-slate-500"
                    }
                  `}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12a2 2 0 0 1-2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H8a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 0 0-4 2 2 0 0 1 2-2h8a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 2 2Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9h6M9 15h4"
                      />
                    </svg>
                  </span>

                  <span>
                    Coupons
                  </span>

                </span>
              </Link>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className={`
                my-1 border-t
                ${isLight ? "border-white/10" : "border-slate-100"}
              `} />

              {/* =================================================
                  LOGOUT
              ================================================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl px-4 py-2 text-left text-[12px] text-red-400 transition hover:bg-red-500/10"
              >

                <span className="flex items-center gap-3">

                  <span className={`
                    flex h-6 w-6 items-center justify-center rounded-lg
                    ${isLight ? "bg-red-500/10" : "bg-red-50"}
                  `}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-3 w-3"
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

                  <span>
                    Logout
                  </span>

                </span>

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
          className={`
            mt-2 block rounded-full px-5 py-2 text-center text-[12px] transition
            ${isLight 
              ? "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" 
              : "border border-[#8b542f]/30 bg-white text-[#8b542f] hover:bg-[#8b542f]/5"
            }
          `}
        >
          Login
        </Link>

      )}

    </div>
  );
}

export default MobileMenu;