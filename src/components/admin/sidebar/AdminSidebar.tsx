import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Gift,
  MessageSquareText,
  X,
} from "lucide-react";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function AdminSidebar({
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const logout = useAdminAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();

    onClose?.();

    navigate("/admin", {
      replace: true,
    });
  };

  const navigationItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <LayoutDashboard
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: (
        <Package
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <ShoppingBag
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Customers",
      path: "/admin/users",
      icon: (
        <Users
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: (
        <CreditCard
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: (
        <BarChart3
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Reviews",
      path: "/admin/reviews",
      icon: (
        <MessageSquareText
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Offers",
      path: "/admin/offers",
      icon: (
        <Gift
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: (
        <Settings
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
  ];

  const handleNavigation = () => {
    onClose?.();
  };

  return (
    <>
      {/* =========================================================
          MOBILE BACKDROP
      ========================================================= */}
      <div
        className={[
          "fixed inset-0 z-40 bg-[#1F4A2E]/20 backdrop-blur-[2px]",
          "transition-opacity duration-300 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* =========================================================
          MOBILE SIDEBAR
      ========================================================= */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
          "border-r border-[#F0E3E5]",
          "bg-white",
          "shadow",
          "transition-transform duration-300 ease-out",
          "lg:hidden",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/* ================= MOBILE BRAND ================= */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#B5697A]
                text-white
                shadow-sm
              "
            >
              <span className="text-[11px] font-bold tracking-wide">
                GC
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#1F4A2E]">
                GuiltFree
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-[#A89486]">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full
              border border-[#EADBD0]
              bg-white
              text-[#6F6259]
              transition-all duration-200
              hover:border-[#D9B8C1]
              hover:bg-[#FDF4F6]
              hover:text-[#B5697A]
              focus:outline-none
            "
          >
            <X
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F0E3E5]" />

        {/* ================= MOBILE NAVIGATION ================= */}
        <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3",
                    "rounded-lg px-3 py-1.5",
                    "text-[13px]",
                    "transition-all duration-200",
                    "focus:outline-none",

                    isActive
                      ? "bg-[#B5697A] text-white shadow-sm"
                      : "text-[#6F6259] hover:bg-[#FBEEF1] hover:text-[#B5697A]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center",
                        "rounded-lg transition-all duration-200",

                        isActive
                          ? "text-white"
                          : "text-[#8B7A6C] group-hover:text-[#B5697A]",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>

                    <span className="truncate">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ================= MOBILE LOGOUT ================= */}
        <div className="border-t border-[#F0E3E5] px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex w-full items-center gap-3
              rounded-lg
              bg-[#FBEEF1]
              px-3 py-2
              text-[13px]
              text-[#B5697A]
              transition-all duration-200
              hover:bg-[#F7DDE3]
              focus:outline-none
            "
          >
            <span
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                text-[#B5697A]
              "
            >
              <LogOut
                size={17}
                strokeWidth={1.8}
              />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside
        className="
          hidden
          h-screen
          w-[248px]
          shrink-0
          border-r
          border-[#F0E3E5]
          bg-white
          lg:flex
          lg:flex-col
        "
      >
        {/* ================= BRAND ================= */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-lg
                bg-[#B5697A]
                text-white
                shadow-sm
              "
            >
              <span className="text-[11px] font-bold tracking-wide">
                GC
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#2C2C2C]">
                GuiltFree
              </p>

              <p className="mt-0 text-[10px] font-semibold text-[#A89486]">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-[#F0E3E5]" />

        {/* ================= NAVIGATION ================= */}
        <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3",
                    "rounded-lg px-3 py-1.5",
                    "text-[13px]",
                    "focus:outline-none",

                    isActive
                      ? "bg-[#B5697A] text-white"
                      : "text-gray-600 hover:bg-[#FBEEF1] hover:text-[#B5697A]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center",
                        "rounded-lg transition-all duration-200",

                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-[#B5697A]",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>

                    <span className="truncate">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-[#F0E3E5] px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex w-full items-center gap-3
              rounded-lg
              px-3 py-1.5
              text-[13px]
              text-[#B5697A]
              transition-all duration-200
              bg-[#FBEEF1]
              hover:bg-[#F7DDE3]
            "
          >
            <span
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                text-[#B5697A]
              "
            >
              <LogOut
                size={17}
                strokeWidth={1.8}
              />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= SCROLLBAR ================= */}
      <style>
        {`
          .admin-sidebar-scroll::-webkit-scrollbar {
            width: 3px;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-thumb {
            background: #ead9dd;
            border-radius: 999px;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: #d9b7c0;
          }
        `}
      </style>
    </>
  );
}

export default AdminSidebar;