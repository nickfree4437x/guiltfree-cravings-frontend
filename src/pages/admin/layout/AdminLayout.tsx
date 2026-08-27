import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";

function AdminLayout() {
  const navigate = useNavigate();

  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const logout = useAdminAuthStore(
    (state) => state.logout
  );

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    logout();

    navigate("/admin", {
      replace: true,
    });
  };

  /*
   * =========================================================
   * MOBILE NAVIGATION
   * =========================================================
   *
   * Desktop navigation is handled by AdminSidebar.
   *
   * Mobile navigation is kept here because the desktop
   * sidebar is hidden on smaller screens.
   */

  const mobileNavigation = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "Products",
      path: "/admin/products",
    },
    {
      label: "Orders",
      path: "/admin/orders",
    },
    {
      label: "Customers",
      path: "/admin/users",
    },
    {
      label: "Inventory",
      path: "/admin/inventory",
    },
    {
      label: "Payments",
      path: "/admin/payments",
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="flex min-h-screen">

        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <AdminSidebar />

        {/* =====================================================
            MAIN APPLICATION AREA
        ===================================================== */}

        <div className="min-w-0 flex-1">

          {/* ===================================================
              MOBILE HEADER
          =================================================== */}

          <header className="border-b border-[#eadfd3] bg-white lg:hidden">

            {/* HEADER TOP */}

            <div className="flex items-center justify-between gap-4 px-5 py-4">

              <div className="min-w-0">

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b542f]">
                  GuiltFree Cravings
                </span>

                <p className="mt-0.5 truncate text-base font-bold text-slate-900">
                  Admin Panel
                </p>

              </div>

              {/* ADMIN INFO */}

              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-right text-xs font-semibold text-slate-800">
                  {admin?.name || "Administrator"}
                </p>

                <p className="mt-0.5 truncate text-right text-[11px] text-slate-400">
                  {admin?.email ||
                    admin?.phone ||
                    "Admin Account"}
                </p>
              </div>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 rounded-xl border border-[#eadfd3] bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                Logout
              </button>

            </div>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <div className="border-t border-[#eadfd3] px-5 py-3">

              <nav
                className="flex gap-2 overflow-x-auto pb-1"
                aria-label="Admin navigation"
              >

                {mobileNavigation.map(
                  (item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        [
                          "shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-semibold transition",
                          isActive
                            ? "bg-[#8b542f] text-white shadow-sm"
                            : "bg-[#fffaf5] text-slate-600 hover:bg-[#fff3e8] hover:text-[#8b542f]",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                )}

              </nav>

            </div>

          </header>

          {/* ===================================================
              PAGE CONTENT
          =================================================== */}

          <main className="min-h-[calc(100vh-80px)]">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}

export default AdminLayout;