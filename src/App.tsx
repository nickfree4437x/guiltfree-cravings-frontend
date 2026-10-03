import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import CartDrawer from "./components/cart/drawer/CartDrawer";

function App() {
  return (
    <BrowserRouter>

      {/* Global Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#ffffff",
            color: "#333333",
            fontSize: "13px",
            fontWeight: "400",
            padding: "12px 16px",
            boxShadow:
              "0 4px 10px rgba(0, 0, 0, 0.08)",
            border: "1px solid #eeeeee",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        <Route
          path="/*"
          element={<AppRoutes />}
        />

        <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />
      </Routes>

      <CartDrawer />

    </BrowserRouter>
  );
}

export default App;