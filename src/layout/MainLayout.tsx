import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/landing/navbar/Navbar";
import Footer from "../components/landing/Footer";

function MainLayout() {
  const location = useLocation();

  // Transparent navbar only on landing page
  const isHomePage = location.pathname === "/";

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