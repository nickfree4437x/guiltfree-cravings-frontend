import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Website */}
        <Route
          path="/*"
          element={<AppRoutes />}
        />

        {/* Admin Panel */}
        <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;