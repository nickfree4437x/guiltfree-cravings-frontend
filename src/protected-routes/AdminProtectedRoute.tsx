import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAdminAuthStore } from "../store/adminAuthStore";

function AdminProtectedRoute() {
  const location = useLocation();

  const isAuthenticated =
    useAdminAuthStore(
      (state) => state.isAuthenticated
    );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default AdminProtectedRoute;