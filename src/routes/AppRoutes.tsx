import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import HomePage from "../pages/home-page/HomePage";
import ProductDetailsPage from "../pages/product-details/ProductDetailsPage";
import CheckoutPage from "../pages/check-out/CheckoutPage";
import PaymentPage from "../pages/payment-page/PaymentPage";
import OrderSuccessPage from "../pages/order-success/OrderSuccessPage";
import MyOrdersPage from "../pages/my-orders/MyOrdersPage";
import ProfilePage from "../pages/profile/ProfilePage";
import LoginPage from "../pages/login/LoginPage";
import WishlistPage from "../pages/wishlist/WishlistPage";
import CouponsPage from "../pages/coupons/CouponsPage";

// Account
import AccountPage from "../components/landing/navbar/AccountPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          MAIN WEBSITE LAYOUT
          Navbar + Outlet + Footer
      ========================= */}
      <Route element={<MainLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<ProductDetailsPage />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        {/* Payment */}
        <Route
          path="/payment"
          element={<PaymentPage />}
        />

        {/* Order Success */}
        <Route
          path="/order-success"
          element={<OrderSuccessPage />}
        />

        {/* My Orders */}
        <Route
          path="/orders"
          element={<MyOrdersPage />}
        />

        {/* Account */}
        <Route
          path="/account"
          element={<AccountPage />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={<WishlistPage />}
        />

        {/* Coupons */}
        <Route
          path="/coupons"
          element={<CouponsPage />}
        />

      </Route>
    </Routes>
  );
};

export default AppRoutes;