import { Routes, Route } from "react-router-dom";

import AdminLoginPage from "../pages/admin/auth/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/product-page/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/orders/AdminOrdersPage";
import AdminCustomersPage from "../pages/admin/users/AdminCustomersPage";
import CustomerDetailsPage from "../pages/admin/users/CustomerDetailsPage";
import AdminPaymentsPage from "../pages/admin/payments/AdminPaymentsPage";
import AdminAnalyticsPage from "../pages/admin/analytics/AdminAnalyticsPage";
import AdminOffers from "../pages/admin/offers/AdminOffersPage";
import AdminSettingsPage from "../pages/admin/settings/AdminSettingsPage";
import AdminReviewsPage from "../pages/admin/reviews/AdminReviewsPage";
import AdminOrderDetailsPage from "../pages/admin/orders/AdminOrderDetailsPage";

import AdminLayout from "../pages/admin/layout/AdminLayout";
import AdminProtectedRoute from "../protected-routes/AdminProtectedRoute";

// ─── Route Config ─────────────────────────────────────────
const ADMIN_ROUTES = [
  { path: "dashboard", element: <AdminDashboardPage /> },
  { path: "products", element: <AdminProductsPage /> },
  { path: "reviews", element: <AdminReviewsPage /> },
  { path: "orders", element: <AdminOrdersPage /> },
  { path: "orders/:id", element: <AdminOrderDetailsPage /> },
  { path: "payments", element: <AdminPaymentsPage /> },
  { path: "analytics", element: <AdminAnalyticsPage /> },
  { path: "offers", element: <AdminOffers /> },
  { path: "users", element: <AdminCustomersPage /> },
  { path: "customers/:id", element: <CustomerDetailsPage /> },
  { path: "settings", element: <AdminSettingsPage /> },
];

// ─── Component ────────────────────────────────────────────
function AdminRoutes() {
  return (
    <Routes>
      {/* Admin login */}
      <Route index element={<AdminLoginPage />} />

      {/* Protected admin panel */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {ADMIN_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminRoutes;