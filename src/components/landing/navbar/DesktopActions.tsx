import { Link } from "react-router-dom";

import AccountDropdown from "./AccountDropdown";

interface DesktopActionsProps {
  cartItemCount: number;

  isAuthenticated: boolean;

  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;

  displayName: string;
  userInitial: string;

  isAccountOpen: boolean;

  onAccountToggle: () => void;
  onAccountClose: () => void;
  onLogout: () => void;

  variant?: "dark" | "light";
}

function DesktopActions({
  cartItemCount,
  isAuthenticated,
  user,
  displayName,
  userInitial,
  isAccountOpen,
  onAccountToggle,
  onAccountClose,
  onLogout,
  variant = "dark",
}: DesktopActionsProps) {
  const isLight = variant === "light";

  return (
    <div className="hidden items-center gap-2.5 lg:flex">
      {/* =======================================================
          ACCOUNT / LOGIN
      ======================================================= */}

      {isAuthenticated ? (
        <AccountDropdown
          user={user}
          displayName={displayName}
          userInitial={userInitial}
          isOpen={isAccountOpen}
          onToggle={onAccountToggle}
          onClose={onAccountClose}
          onLogout={onLogout}
          variant={variant}
        />
      ) : (
        <Link
          to="/login"
          className={`
            inline-flex
            h-9
            items-center
            justify-center
            rounded-full
            border
            px-5
            text-[13px]
            transition-all
            duration-200
            ${
              isLight
                ? "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/15"
                : "border-[#B5697A]/25 bg-white text-[#B5697A] hover:bg-[#B5697A]/5"
            }
          `}
        >
          Login
        </Link>
      )}

      {/* =======================================================
          CART
      ======================================================= */}

      <Link
        to="/cart"
        className={`
          group
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          transition-all
          duration-200
          active:scale-95
          ${
            isLight
              ? "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/15"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#B5697A]/40 hover:bg-[#B5697A]/5 hover:text-[#B5697A]"
          }
        `}
        aria-label={`Shopping cart with ${cartItemCount} items`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="
            h-[18px]
            w-[18px]
            transition-transform
            duration-200
            group-hover:scale-105
          "
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
            className={`
              absolute
              -right-1.5
              -top-1.5
              flex
              min-h-[18px]
              min-w-[18px]
              items-center
              justify-center
              rounded-full
              px-1
              text-[9px]
              font-semibold
              leading-none
              shadow-sm
              ${
                isLight
                  ? "bg-white text-[#B5697A]"
                  : "bg-[#B5697A] text-white"
              }
            `}
          >
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </span>
        )}
      </Link>
    </div>
  );
}

export default DesktopActions;