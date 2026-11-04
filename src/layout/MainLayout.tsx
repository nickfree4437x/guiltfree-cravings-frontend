
import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import Navbar from "../components/landing/navbar/Navbar";
import Footer from "../components/landing/Footer";
import Breadcrumb from "../components/common/Breadcrumb";
import { BreadcrumbProvider } from "../context/BreadcrumbContext";

function MainLayout() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  return (
    <BreadcrumbProvider>
      <Navbar isHomePage={isHomePage} />

      {!isHomePage && !isLoginPage && <Breadcrumb />}

      <main>
        <Outlet />
      </main>

      <Footer />
    </BreadcrumbProvider>
  );
}

export default MainLayout;
