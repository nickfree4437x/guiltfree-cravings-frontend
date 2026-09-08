// src/pages/admin/layout/AdminLayout.tsx

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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
   * PAGE TITLE
   * =========================================================
   */

  const getPageTitle = () => {
    const pathname = location.pathname;

    if (pathname === "/admin/dashboard") {
      return {
        title: "Dashboard",
        description:
          "Overview of your store and recent activity.",
      };
    }

    if (pathname.startsWith("/admin/products")) {
      return {
        title: "Products",
        description:
          "Manage your products and product variants.",
      };
    }

    if (pathname.startsWith("/admin/orders")) {
      return {
        title: "Orders",
        description:
          "View and manage customer orders.",
      };
    }

    if (pathname.startsWith("/admin/users")) {
      return {
        title: "Customers",
        description:
          "Manage your customers and their activity.",
      };
    }

    if (pathname.startsWith("/admin/offers")) {
      return {
        title: "Offers",
        description:
          "Create and manage offers for your customers.",
      };
    }

    if (pathname.startsWith("/admin/payments")) {
      return {
        title: "Payments",
        description:
          "Monitor payments and transaction activity.",
      };
    }

    if (pathname.startsWith("/admin/analytics")) {
      return {
        title: "Analytics",
        description:
          "Track store performance and business insights.",
      };
    }

    if (pathname.startsWith("/admin/settings")) {
      return {
        title: "Settings",
        description:
          "Manage your admin and store settings.",
      };
    }

    return {
      title: "Admin Panel",
      description:
        "Manage your GuiltFree Cravings store.",
    };
  };

  const page = getPageTitle();

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="flex min-h-screen">

        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar />
          </div>
        </div>

        {/* =====================================================
            MAIN APPLICATION AREA
        ===================================================== */}

        <div className="min-w-0 flex-1">

          {/* ===================================================
              TOP HEADER
          =================================================== */}

          <AdminHeader
            title={page.title}
            description={page.description}
            onLogout={handleLogout}
          />

          {/* ===================================================
              MOBILE BRAND / NAV BAR
          =================================================== */}

          <div className="border-b border-[#eadfd3] bg-white px-5 py-3 lg:hidden">
            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-[#8b542f]">
                  GuiltFree Cravings
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e4d3] text-xs font-bold text-[#8b542f]">
                  A
                </span>

                <span className="max-w-[120px] truncate text-xs font-semibold text-slate-700">
                  Administrator
                </span>
              </div>

            </div>
          </div>

          {/* ===================================================
              PAGE CONTENT
          =================================================== */}

          <main className="min-h-[calc(100vh-76px)]">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}

export default AdminLayout;