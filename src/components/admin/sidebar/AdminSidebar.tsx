import { NavLink, useNavigate } from "react-router-dom";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

function AdminSidebar() {
  const navigate = useNavigate();

  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const logout = useAdminAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();

    navigate("/admin", {
      replace: true,
    });
  };

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "▦",
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: "◫",
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: "□",
    },
    {
      label: "Customers",
      path: "/admin/users",
      icon: "◯",
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: "₹",
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: "◒",
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: "⚙",
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#eadfd3] bg-white lg:flex lg:flex-col">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="border-b border-[#eadfd3] px-6 py-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
          GuiltFree Cravings
        </span>

        <h1 className="mt-1 text-lg font-bold text-slate-900">
          Admin Panel
        </h1>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {/* MANAGEMENT */}

        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Management
        </p>

        <div className="space-y-1">
          {navigationItems
            .slice(0, 4)
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#fff3e8] text-[#8b542f]"
                      : "text-slate-600 hover:bg-[#fffaf5] hover:text-[#8b542f]",
                  ].join(" ")
                }
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-current/5 text-sm"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
        </div>

        {/* OPERATIONS */}

        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Operations
        </p>

        <div className="space-y-1">
          {navigationItems
            .slice(4, 6)
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#fff3e8] text-[#8b542f]"
                      : "text-slate-600 hover:bg-[#fffaf5] hover:text-[#8b542f]",
                  ].join(" ")
                }
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-current/5 text-sm"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
        </div>

        {/* INSIGHTS */}

        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Insights
        </p>

        <div className="space-y-1">
          {navigationItems
            .slice(6, 7)
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#fff3e8] text-[#8b542f]"
                      : "text-slate-600 hover:bg-[#fffaf5] hover:text-[#8b542f]",
                  ].join(" ")
                }
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-current/5 text-sm"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
        </div>

        {/* SYSTEM */}

        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          System
        </p>

        <div className="space-y-1">
          {navigationItems
            .slice(7)
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#fff3e8] text-[#8b542f]"
                      : "text-slate-600 hover:bg-[#fffaf5] hover:text-[#8b542f]",
                  ].join(" ")
                }
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-current/5 text-sm"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
        </div>
      </nav>

      {/* =====================================================
          ADMIN ACCOUNT
      ===================================================== */}

      <div className="border-t border-[#eadfd3] bg-white p-4">
        <div className="mb-3 rounded-2xl bg-[#fffaf5] p-4">
          <p className="truncate text-sm font-bold text-slate-900">
            {admin?.name || "Administrator"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {admin?.email ||
              admin?.phone ||
              "Admin Account"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <span
            className="text-base"
            aria-hidden="true"
          >
            ↪
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;