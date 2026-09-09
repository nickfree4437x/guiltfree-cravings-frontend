import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import AccountAuthRequired from "../../components/account/AccountAuthRequired";
import AccountHeader from "../../components/account/AccountHeader";
import AccountSidebar from "../../components/account/AccountSidebar";
import AccountProfileForm from "../../components/account/AccountProfileForm";

function AccountPage() {
  const navigate = useNavigate();

  /*
   * =========================================================
   * AUTH STORE
   * =========================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  const logout = useAuthStore(
    (state) => state.logout
  );

  /*
   * =========================================================
   * AUTHENTICATION CHECK
   * =========================================================
   */

  if (
    !isAuthenticated ||
    !user ||
    !token
  ) {
    return <AccountAuthRequired />;
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  /*
   * =========================================================
   * USER DISPLAY NAME
   * =========================================================
   */

  const displayName =
    user.name?.trim() || "My Account";

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffaf5]">

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-12">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <AccountHeader />
        </div>

        {/* =================================================
            ACCOUNT CONTENT
        ================================================= */}

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">

          {/* =================================================
              ACCOUNT SIDEBAR
          ================================================= */}

          <aside
            className="min-w-0"
            aria-label="Account navigation"
          >
            <AccountSidebar
              name={displayName}
              email={user.email}
              phone={user.phone}
              onLogout={handleLogout}
            />
          </aside>

          {/* =================================================
              PROFILE
          ================================================= */}

          <section
            className="min-w-0"
            aria-label="Profile information"
          >
            <AccountProfileForm
              user={user}
              token={token}
            />
          </section>

        </div>

        {/* =================================================
            BACK TO SHOP
        ================================================= */}

        <div className="mt-10 border-t border-[#eadfd3] pt-7 text-center sm:mt-12 sm:pt-8">

          <a
            href="/#products"
            className="group inline-flex items-center gap-2 text-sm text-[#8b542f] transition-colors duration-200 hover:text-[#744324] hover:underline focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              ←
            </span>

            Continue Shopping
          </a>

        </div>

      </div>

    </main>
  );
}

export default AccountPage;