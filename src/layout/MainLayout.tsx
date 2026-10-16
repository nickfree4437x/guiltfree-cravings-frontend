import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import Navbar from "../components/landing/navbar/Navbar";
import Footer from "../components/landing/Footer";

function MainLayout() {
  const location = useLocation();

  // Identify the homepage.
  const isHomePage = location.pathname === "/";

  // Reset scroll before the browser paints the new route.
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

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