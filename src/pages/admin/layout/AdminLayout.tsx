// src/pages/admin/layout/AdminLayout.tsx

import {
  useEffect,
  useState,
} from "react";

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

  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const logout = useAdminAuthStore(
    (state) => state.logout
  );

  /*
   * =========================================================
   * MOBILE SIDEBAR
   * =========================================================
   */

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  /*
   * =========================================================
   * CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
   * =========================================================
   */

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  /*
   * =========================================================
   * LOCK BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
   * =========================================================
   */

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  /*
   * =========================================================
   * ADMIN INITIAL
   * =========================================================
   */

  // const adminInitial =
    admin?.name?.charAt(0)?.toUpperCase() || "A";

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    setIsSidebarOpen(false);

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

    if (pathname.startsWith("/admin/reviews")) {
      return {
        title: "Reviews",
        description:
          "Manage customer reviews and feedback.",
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
    <div className="h-screen overflow-hidden bg-white">
      <div className="flex h-screen min-h-0">

        {/* =====================================================
            ADMIN SIDEBAR
            Desktop + Mobile Drawer
        ===================================================== */}

        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        {/* =====================================================
            MAIN APPLICATION AREA
        ===================================================== */}

        <div
          className="
            flex
            h-screen
            min-h-0
            min-w-0
            flex-1
            flex-col
          "
        >

          {/* ===================================================
              TOP HEADER
          =================================================== */}

          <AdminHeader
            title={page.title}
            description={page.description}
            onLogout={handleLogout}
            onMenuClick={() =>
              setIsSidebarOpen(true)
            }
          />
          {/* ===================================================
              SCROLLABLE MAIN CONTENT
          =================================================== */}

          <main
            className="
              min-h-0
              flex-1
              overflow-y-auto
              bg-white
            "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;