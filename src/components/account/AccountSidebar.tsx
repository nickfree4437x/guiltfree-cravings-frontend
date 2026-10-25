import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────
interface AccountSidebarProps {
  name: string | null | undefined;
  email: string | null | undefined;
  phone: string;
  onLogout: () => void;
}

// ─── Nav Items Config ─────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "My Profile",
    to: "/account",
    paths: ["M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"],
  },
  {
    label: "My Orders",
    to: "/orders",
    paths: ["M6 3h12v18H6z", "M9 7h6M9 11h6M9 15h4"],
  },
  {
    label: "Wishlist",
    to: "/wishlist",
    paths: ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"],
  },
  {
    label: "Coupons",
    to: "/coupons",
    paths: [
      "M20 12a2 2 0 0 0 0-4V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a2 2 0 0 0-1-4Z",
      "M12 8v8",
      "M9.5 10.5h.01M14.5 13.5h.01",
    ],
  },
];

const LOGOUT_PATHS = ["M10 17l5-5-5-5", "M15 12H3", "M21 19V5a2 2 0 0 0-2-2h-6"];

// ─── Icon ─────────────────────────────────────────────────
function NavIcon({ paths, className = "h-5 w-5" }: { paths: string[]; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────
function AccountSidebar({ name, email, phone, onLogout }: AccountSidebarProps) {
  const displayName = name?.trim() || "GuiltFree Customer";
  const avatarLetter = name?.trim()?.charAt(0) || phone?.charAt(0) || "U";

  return (
    <aside className="h-fit rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">
      {/* User preview */}
      <div className="rounded-2xl bg-[#fffaf5] p-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
          <span className="text-xl font-bold text-[#8b542f]">
            {avatarLetter.toUpperCase()}
          </span>
        </div>

        <h2 className="mt-4 break-words text-base font-bold text-slate-900">
          {displayName}
        </h2>

        <p className="mt-1 break-all text-xs text-slate-500">{email || phone}</p>
      </div>

      {/* Navigation */}
      <nav className="mt-5 space-y-2" aria-label="Account navigation">
        {NAV_ITEMS.map(({ label, to, paths }) => {
          const isActive = to === "/account"; // Profile is always active on this page
          return (
            <Link
              key={to}
              to={to}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-2xl bg-[#8b542f] px-4 py-3 text-sm font-semibold text-white"
                  : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
              }
            >
              <NavIcon paths={paths} />
              {label}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <NavIcon paths={LOGOUT_PATHS} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default AccountSidebar;