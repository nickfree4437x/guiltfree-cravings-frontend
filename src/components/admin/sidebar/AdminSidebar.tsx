// src/components/admin/AdminSidebar.tsx

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
} from "lucide-react";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function AdminSidebar() {
  const navigate = useNavigate();

  const admin = useAdminAuthStore((state) => state.admin);
  const logout = useAdminAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  // Navigation items with proper icons
  const navigationItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "Customers",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <CreditCard size={20} />,
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Offers",
      path: "/admin/offers",
      icon: <Gift size={20} />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-[#eadfd3] bg-white lg:flex lg:flex-col">
      {/* Brand Section - Simple */}
      <div className="border-b border-[#eadfd3] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b542f] text-white">
            <span className="text-sm font-semibold">GC</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b542f]">
              GuiltFree
            </span>

            <p className="-mt-0.5 text-[12px] text-slate-700 md:text-[13px]">
              Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Clean & Simple */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-[450] transition-all duration-200 md:text-[14px]",
                  isActive
                    ? "bg-[#8b542f] text-white"
                    : "text-slate-600 hover:bg-[#f8eee4] hover:text-[#8b542f]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-[#8b542f]"
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Admin Account - Bottom */}
      <div className="mt-auto border-t border-[#eadfd3] bg-white p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 md:text-[14.5px]"
        >
          <LogOut size={16} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;