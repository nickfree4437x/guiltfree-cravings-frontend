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
  user,
  displayName,
  userInitial,
  isOpen,
  onToggle,
  onClose,
  onLogout,
  variant = "dark",
}: AccountDropdownProps) {
  const isLight = variant === "light";

  /*
   * =========================================================
   * THEME CLASSES
   * =========================================================
   */

  const dropdownClasses = isLight
    ? "border-white/20 bg-transparent backdrop-blur-md"
    : "border-slate-200 bg-white";

  const accountHeaderClasses = isLight
    ? "bg-white/10"
    : "bg-[#fffaf5]";

  const accountNameClasses = isLight
    ? "text-white"
    : "text-[#2f2f2f]";

  const accountEmailClasses = isLight
    ? "text-white/70"
    : "text-slate-500";

  const linkClasses = isLight
    ? "text-white hover:bg-white/10 hover:text-white"
    : "text-[#2f2f2f] hover:bg-[#fffaf5] hover:text-[#8b542f]";

  const iconClasses = isLight
    ? "bg-white/10 text-white"
    : "bg-slate-100 text-[#2f2f2f]";

  const dividerClasses = isLight
    ? "border-white/10"
    : "border-slate-100";

  const logoutClasses = isLight
    ? "text-white hover:bg-white/10"
    : "text-red-600 hover:bg-red-50";

  const logoutIconClasses = isLight
    ? "bg-white/10 text-white"
    : "bg-red-50 text-red-600";

  return (
    <div className="relative">

      {/* =====================================================
          ACCOUNT TOGGLE
      ===================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all duration-300 ${
          isLight
            ? "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20"
            : "border-slate-200 bg-white text-[#2f2f2f] hover:border-[#8b542f]/30 hover:bg-[#8b542f]/5 hover:text-[#8b542f]"
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >

        {/* =================================================
            AVATAR
        ================================================= */}

        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b542f] text-xs font-bold text-white">
          {userInitial}
        </span>


        {/* =================================================
            CHEVRON
        ================================================= */}

        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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

      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {isOpen && (
        <div
          className={`absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-xl border p-2 shadow-sm transition-all duration-300 ${dropdownClasses}`}
          role="menu"
        >
          {/* =================================================
              MY PROFILE
          ================================================= */}

          <Link
            to="/profile"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-[12px] transition-all duration-200 md:text-[12px] ${linkClasses}`}
            role="menuitem"
          >

            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}
            >
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
            className={`flex items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-[12px] transition-all duration-200 md:text-[12px] ${linkClasses}`}
            role="menuitem"
          >

            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}
            >
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
            className={`flex items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-[12px] transition-all duration-200 md:text-[12px] ${linkClasses}`}
            role="menuitem"
          >

            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}
            >
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
            className={`flex items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-[12px] transition-all duration-200 md:text-[12px] ${linkClasses}`}
            role="menuitem"
          >

            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}
            >
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
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v1a2.5 2.5 0 0 1-2 2.45v1.1a2.5 2.5 0 0 1 2 2.45v1A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-1a2.5 2.5 0 0 1 2-2.45v-1.1a2.5 2.5 0 0 1-2-2.45v-1Z"
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
            className={`my-1 border-t ${dividerClasses}`}
          />

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={onLogout}
            className={`flex w-full items-center gap-3 rounded-xl bg-transparent px-3 py-2 text-left text-[12px] transition-all duration-200 md:text-[12px] ${logoutClasses}`}
            role="menuitem"
          >

            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${logoutIconClasses}`}
            >
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