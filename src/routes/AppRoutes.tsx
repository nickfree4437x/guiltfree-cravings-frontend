import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import HomePage from "../pages/home-page/HomePage";
import ProductDetailsPage from "../pages/product-details/ProductDetailsPage";
import CheckoutPage from "../pages/check-out/CheckoutPage";
import OrderSuccessPage from "../pages/order-success/OrderSuccessPage";
import MyOrdersPage from "../pages/my-orders/MyOrdersPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";
import OrderHistoryPage from "../pages/order-history/OrderHistoryPage";
import ProfilePage from "../pages/profile/ProfilePage";
import LoginPage from "../pages/login/LoginPage";
import WishlistPage from "../pages/wishlist/WishlistPage";
import CouponsPage from "../pages/coupons/CouponsPage";
import PrivacyPolicyPage from "../pages/privacy-policy/PrivacyPolicyPage";
import TermsAndConditionsPage from "../pages/terms-and-conditions/TermsAndConditionsPage";
import PaymentResultPage from "../pages/payment-result/PaymentResultPage";
import AccountPage from "../components/landing/navbar/AccountPage";
import MyIssuesPage from "../pages/profile/MyIssuesPage";

// ─── Route Config ─────────────────────────────────────────
const APP_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/products/:id", element: <ProductDetailsPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/payment-result", element: <PaymentResultPage /> },
  { path: "/order-success", element: <OrderSuccessPage /> },
  { path: "/orders/:orderId", element: <OrderDetailsPage /> },
  { path: "/orders", element: <MyOrdersPage /> },
  { path: "/order-history", element: <OrderHistoryPage /> },
  { path: "/my-issues", element: <MyIssuesPage/>},
  { path: "/account", element: <AccountPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/coupons", element: <CouponsPage /> },
  { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
  { path: "/terms-and-conditions", element: <TermsAndConditionsPage /> },
];

// ─── Component ────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>
      {/* Main layout: Navbar + Outlet + Footer */}
      <Route element={<MainLayout />}>
        {APP_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;