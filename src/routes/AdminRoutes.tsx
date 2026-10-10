import {
  Routes,
  Route,
} from "react-router-dom";

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

import AdminLayout from "../pages/admin/layout/AdminLayout";
import AdminProtectedRoute from "../protected-routes/AdminProtectedRoute";

function AdminRoutes() {
  return (
    <Routes>
      {/* Admin Login */}
      <Route
        index
        element={<AdminLoginPage />}
      />

      {/* Protected Admin Panel */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboardPage />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<AdminProductsPage />}
          />

          {/* Reviews */}
          <Route
            path="reviews"
            element={<AdminReviewsPage />}
          />

          {/* Orders */}
          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />

          {/* Payments */}
          <Route
            path="payments"
            element={<AdminPaymentsPage />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<AdminAnalyticsPage />}
          />

          {/* Offers */}
          <Route
            path="offers"
            element={<AdminOffers />}
          />

          {/* Customers */}
          <Route
            path="users"
            element={<AdminCustomersPage />}
          />

          {/* Customer Details */}
          <Route
            path="customers/:id"
            element={<CustomerDetailsPage />}
          />

          {/* Settings */}
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