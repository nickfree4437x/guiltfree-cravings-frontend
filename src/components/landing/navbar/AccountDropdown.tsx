import { Link } from "react-router-dom";

interface AccountUser {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface AccountDropdownProps {
  user: AccountUser | null;
  displayName: string;
  userInitial: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  variant?: "light" | "dark";
}

function AccountDropdown({
  userInitial,
  isOpen,
  onToggle,
  onClose,
  onLogout,
  variant = "dark",
}: AccountDropdownProps) {
  const isLight = variant === "light";

  return (
    <div className="relative">
      {/* =====================================================
          ACCOUNT TOGGLE
      ===================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className={`
          flex
          h-10
          items-center
          gap-2
          rounded-full
          border
          px-2
          pr-3
          transition-all
          duration-200
          active:scale-[0.98]
          ${
            isLight
              ? "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/15"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#B5697A]/35 hover:bg-[#B5697A]/5 hover:text-[#B5697A]"
          }
        `}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {/* AVATAR */}

        <span
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-[#B5697A]
            text-[11px]
            font-semibold
            text-white
            shadow-sm
          "
        >
          {userInitial}
        </span>

        {/* ACCOUNT LABEL */}

        <span
          className={`
            hidden
            text-[12px]
            font-medium
            xl:block
            ${
              isLight
                ? "text-white/90"
                : "text-slate-700"
            }
          `}
        >
          Account
        </span>

        {/* CHEVRON */}

        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className={`
            h-3.5
            w-3.5
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 7.5 5 5 5-5"
          />
        </svg>
      </button>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {isOpen && (
        <div
          className={`
            absolute
            right-0
            top-[calc(100%+10px)]
            z-50
            w-56
            overflow-hidden
            rounded-2xl
            border
            p-2
            shadow-[0_12px_35px_rgba(0,0,0,0.10)]
            ${
              isLight
                ? "border-white/20 bg-[#2f2f2f]/95 backdrop-blur-xl"
                : "border-slate-100 bg-white"
            }
          `}
          role="menu"
        >
          {/* =================================================
              MY PROFILE
          ================================================= */}

          <Link
            to="/profile"
            onClick={onClose}
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
              duration-200
              ${
                isLight
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
              }
            `}
            role="menuitem"
          >
            <span
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isLight
                    ? "bg-white/10 text-white/70"
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
                  d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                />
              </svg>
            </span>

            <span>My Profile</span>
          </Link>

          {/* =================================================
              MY ORDERS
          ================================================= */}

          <Link
            to="/orders"
            onClick={onClose}
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
              duration-200
              ${
                isLight
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
              }
            `}
            role="menuitem"
          >
            <span
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isLight
                    ? "bg-white/10 text-white/70"
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
                  d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"
                />
              </svg>
            </span>

            <span>My Orders</span>
          </Link>

          {/* =================================================
              WISHLIST
          ================================================= */}

          <Link
            to="/wishlist"
            onClick={onClose}
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
              duration-200
              ${
                isLight
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
              }
            `}
            role="menuitem"
          >
            <span
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isLight
                    ? "bg-white/10 text-white/70"
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
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </span>

            <span>Wishlist</span>
          </Link>

          {/* =================================================
              COUPONS
          ================================================= */}

          <Link
            to="/coupons"
            onClick={onClose}
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
              duration-200
              ${
                isLight
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
              }
            `}
            role="menuitem"
          >
            <span
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isLight
                    ? "bg-white/10 text-white/70"
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
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v1a2.5 2.5 0 0 1-2 2.45v1.1a2.5 2.5 0 0 1 2 2.45v1A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-1a2.5 2.5 0 0 1 2-2.45v-1.1A2.5 2.5 0 0 1 4 8.5v-1Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5v13M15 5v13"
                />
              </svg>
            </span>

            <span>Coupons</span>
          </Link>

          {/* =================================================
              DIVIDER
          ================================================= */}

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

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={onLogout}
            className={`
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
              transition-all
              duration-200
              ${
                isLight
                  ? "text-red-300 hover:bg-red-500/10"
                  : "text-red-500 hover:bg-red-50"
              }
            `}
            role="menuitem"
          >
            <span
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isLight
                    ? "bg-red-500/10 text-red-300"
                    : "bg-red-50 text-red-500"
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
                  d="M10 17l5-5-5-5M15 12H3M21 4v16"
                />
              </svg>
            </span>

            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;