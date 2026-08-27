import {
  Routes,
  Route,
} from "react-router-dom";

import AdminLoginPage from "../pages/admin/auth/AdminLoginPage";

import AdminDashboardPage from "../pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/product-page/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/orders/AdminOrdersPage";
import AdminCustomersPage from "../pages/admin/users/AdminCustomersPage";
import AdminPaymentsPage from "../pages/admin/payments/AdminPaymentsPage";
import AdminAnalyticsPage from "../pages/admin/analytics/AdminAnalyticsPage";
import AdminSettingsPage from "../pages/admin/settings/AdminSettingsPage";

import AdminLayout from "../pages/admin/layout/AdminLayout";

import AdminProtectedRoute from "../protected-routes/AdminProtectedRoute";

function AdminRoutes() {
  return (
    <Routes>

      {/* =====================================================
          ADMIN LOGIN
          /admin
      ===================================================== */}

      <Route
        index
        element={<AdminLoginPage />}
      />

      {/* =====================================================
          PROTECTED ADMIN PANEL
          /admin/*
      ===================================================== */}

      <Route element={<AdminProtectedRoute />}>

        <Route element={<AdminLayout />}>

          {/* =================================================
              DASHBOARD
              /admin/dashboard
          ================================================= */}

          <Route
            path="dashboard"
            element={<AdminDashboardPage />}
          />

          {/* =================================================
              PRODUCTS
              /admin/products
          ================================================= */}

          <Route
            path="products"
            element={<AdminProductsPage />}
          />

          {/* =================================================
              ORDERS
              /admin/orders
          ================================================= */}

          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />

          {/* =================================================
              PAYMENTS
              /admin/payments
          ================================================= */}

          <Route
            path="payments"
            element={<AdminPaymentsPage />}
          />

          {/* =================================================
              ANALYTICS
              /admin/analytics
          ================================================= */}

          <Route
            path="analytics"
            element={<AdminAnalyticsPage />}
          />

          {/* =================================================
              CUSTOMERS
              /admin/users
          ================================================= */}

          <Route
            path="users"
            element={<AdminCustomersPage />}
          />

          {/* =================================================
              SETTINGS
              /admin/settings
          ================================================= */}

          <Route
            path="settings"
            element={<AdminSettingsPage />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default AdminRoutes;