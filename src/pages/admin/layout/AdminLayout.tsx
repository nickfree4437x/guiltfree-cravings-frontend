// src/pages/admin/layout/AdminLayout.tsx

import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuthStore } from "../../../store/adminAuthStore";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";

// ─── Page title config ────────────────────────────────────
const PAGE_TITLES: { match: (path: string) => boolean; title: string; description: string }[] = [
  { match: (p) => p === "/admin/dashboard", title: "Dashboard", description: "Overview of your store and recent activity." },
  { match: (p) => p.startsWith("/admin/products"), title: "Products", description: "Manage your products and product variants." },
  { match: (p) => p.startsWith("/admin/orders"), title: "Orders", description: "View and manage customer orders." },
  { match: (p) => p.startsWith("/admin/users"), title: "Customers", description: "Manage your customers and their activity." },
  { match: (p) => p.startsWith("/admin/offers"), title: "Offers", description: "Create and manage offers for your customers." },
  { match: (p) => p.startsWith("/admin/payments"), title: "Payments", description: "Monitor payments and transaction activity." },
  { match: (p) => p.startsWith("/admin/analytics"), title: "Analytics", description: "Track store performance and business insights." },
  { match: (p) => p.startsWith("/admin/reviews"), title: "Reviews", description: "Manage customer reviews and feedback." },
  { match: (p) => p.startsWith("/admin/settings"), title: "Settings", description: "Manage your admin and store settings." },
];

const DEFAULT_PAGE = {
  title: "Admin Panel",
  description: "Manage your GuiltFree Cravings store.",
};

function getPageTitle(pathname: string) {
  const match = PAGE_TITLES.find((p) => p.match(pathname));
  return match ? { title: match.title, description: match.description } : DEFAULT_PAGE;
}

// ─── Component ────────────────────────────────────────────
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useAdminAuthStore((s) => s.logout);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Logout
  const handleLogout = () => {
    setIsSidebarOpen(false);
    logout();
    navigate("/admin", { replace: true });
  };

  const page = getPageTitle(location.pathname);

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="flex h-screen min-h-0">
        {/* Sidebar (desktop + mobile drawer) */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main area */}
        <div className="flex h-screen min-h-0 min-w-0 flex-1 flex-col">
          <AdminHeader
            title={page.title}
            description={page.description}
            onLogout={handleLogout}
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          <main className="min-h-0 flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;