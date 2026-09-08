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
    <div className="hidden items-center gap-3 lg:flex">
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
            rounded-3xl
            px-4
            py-2
            text-[12px]
            transition-all
            duration-200
            ${isLight 
              ? "border border-white/30 bg-transparent text-white hover:border-white/50" 
              : "border border-[#8b542f]/30 bg-white text-[#8b542f] hover:bg-[#8b542f]/5"
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
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          transition-all
          duration-200
          ${isLight 
            ? "border border-white/30 bg-transparent text-white hover:border-white/50" 
            : "border border-slate-200 bg-white text-slate-700 hover:border-[#8b542f]/30 hover:bg-[#8b542f]/5 hover:text-[#8b542f]"
          }
        `}
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
          <span
            className={`
              absolute
              -right-1.5
              -top-1.5
              flex
              min-h-[19px]
              min-w-[19px]
              items-center
              justify-center
              rounded-full
              px-1
              text-[9px]
              leading-none
              shadow-sm
              ${isLight 
                ? "bg-[#f5d6b3] text-[#2f2f2f]" 
                : "bg-[#8b542f] text-white"
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