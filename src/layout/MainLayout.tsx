import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import Navbar from "../components/landing/navbar/Navbar";
import Footer from "../components/landing/Footer";

// ─── Component ────────────────────────────────────────────
function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Reset scroll before browser paints new route
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // ─── Render ─────────────────────────────────────────────
  return (
    <>
      <Navbar isHomePage={isHomePage} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;