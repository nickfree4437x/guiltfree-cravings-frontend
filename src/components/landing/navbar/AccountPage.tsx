import { useEffect } from "react";

import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ClipboardList,
  LogOut,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuthStore } from "../../../store/authStore";

function AccountPage() {
  const navigate = useNavigate();

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  /*
   * =========================================================
   * AUTH GUARD
   * =========================================================
   */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  /*
   * =========================================================
   * USER DISPLAY
   * =========================================================
   */

  const displayName =
    user?.name?.trim() ||
    "My Account";

  const userInitial =
    user?.name
      ?.trim()
      ?.charAt(0)
      .toUpperCase() || "A";

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  /*
   * =========================================================
   * ACCOUNT ITEMS
   * =========================================================
   */

  const accountItems = [
    {
      title: "My Profile",
      description: "Manage your personal information",
      icon: UserRound,
      to: "/profile",
    },
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: ClipboardList,
      to: "/orders",
    },
    {
      title: "Coupons",
      description: "Check your available offers",
      icon: BadgePercent,
      to: "/coupons",
    },
  ];

  /*
   * =========================================================
   * AUTH LOADING / REDIRECT
   * =========================================================
   */

  if (!isAuthenticated) {
    return null;
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main
      className="
        min-h-screen
        bg-white
        pb-24
        lg:pb-10
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          border-b
          border-[#F1E1E5]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[64px]
            w-full
            max-w-2xl
            items-center
            gap-3
            px-4
            sm:px-6
          "
        >
          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FBEEF1]
              text-[#B5697A]
              transition-all
              duration-200
              hover:bg-[#B5697A]
              hover:text-white
              active:scale-95
            "
          >
            <ChevronLeft
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>

          <div>
            <h1
              className="
                text-[17px]
                font-semibold
                text-[#594D47]
              "
            >
              My Account
            </h1>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[#9A8D84]
              "
            >
              Welcome to GuiltFree Cravings
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-2xl
          px-4
          py-6
          sm:px-6
          sm:py-8
        "
      >
        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-[#B5697A]
            shadow-sm
            mt-2
          "
        >
          {/* DECORATIVE CIRCLES */}

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-12
              h-32
              w-32
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-14
              -left-8
              h-28
              w-28
              rounded-full
              bg-white/5
            "
          />

          <div
            className="
              relative
              flex
              items-center
              gap-4
              px-5
              py-6
              sm:px-6
            "
          >
            {/* AVATAR */}

            <div
              className="
                flex
                h-[58px]
                w-[58px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/30
                bg-white
                text-[20px]
                font-semibold
                text-[#B5697A]
                shadow-[0_6px_18px_rgba(90,50,60,0.12)]
              "
            >
              {userInitial}
            </div>

            {/* USER INFO */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.08em]
                  text-white/70
                "
              >
                Welcome back
              </p>

              <h2
                className="
                  mt-0.5
                  truncate
                  text-[20px]
                  font-semibold
                  text-white
                "
              >
                {displayName}
              </h2>

              {/* PHONE */}

              {user?.phone && (
                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    text-white/80
                  "
                >
                  <Phone
                    className="h-3 w-3 shrink-0"
                    strokeWidth={1.8}
                  />

                  <span>
                    +91 {user.phone}
                  </span>
                </div>
              )}

              {/* EMAIL */}

              {user?.email && (
                <div
                  className="
                    mt-1
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                    text-[10px]
                    text-white/80
                  "
                >
                  <Mail
                    className="h-3 w-3 shrink-0"
                    strokeWidth={1.8}
                  />

                  <span className="truncate">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            ACCOUNT
        =================================================== */}

        <section className="mt-7">
          {/* HEADING */}

          {/* <div className="mb-3 px-1">
            <h2
              className="
                text-[14px]
                font-semibold
                text-[#594D47]
              "
            >
              Account
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[#9A8D84]
              "
            >
              Manage your account
            </p>
          </div> */}

          {/* OPTIONS */}

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-[#F0DDE2]
              bg-white
              shadow-sm
            "
          >
            {accountItems.map(
              ({
                title,
                description,
                icon: Icon,
                to,
              }) => (
                <Link
                  key={title}
                  to={to}
                  className="
                    group
                    flex
                    items-center
                    gap-3.5
                    border-b
                    border-[#F3E7EA]
                    px-4
                    py-4
                    transition-all
                    duration-200
                    last:border-b-0
                    active:bg-[#FBEEF1]
                    sm:px-5
                  "
                >
                  {/* ICON */}

                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FBEEF1]
                      text-[#B5697A]
                      transition-all
                      duration-200
                    "
                  >
                    <Icon
                      className="h-[17px] w-[17px]"
                      strokeWidth={1.8}
                    />
                  </span>

                  {/* TEXT */}

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        text-[13px]
                        font-semibold
                        text-[#594D47]
                        transition-colors
                        duration-200
                      "
                    >
                      {title}
                    </span>

                    <span
                      className="
                        mt-0
                        block
                        truncate
                        text-[10px]
                        text-[#9A8D84]
                      "
                    >
                      {description}
                    </span>
                  </span>

                  {/* ARROW */}

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[#C6B5AE]
                      transition-all
                      duration-200
                      group-hover:bg-[#FBEEF1]
                      group-hover:text-[#B5697A]
                    "
                  >
                    <ArrowRight
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />
                  </span>
                </Link>
              )
            )}
          </div>
        </section>

        {/* ===================================================
            LOGOUT
        =================================================== */}

        <section className="mt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex
              w-full
              items-center
              gap-3.5
              rounded-xl
              border
              border-[#F0DDE2]
              bg-white
              px-4
              py-4
              text-left
              shadow-sm
              transition-all
              duration-200
              hover:bg-[#FBEEF1]/50
              active:bg-[#FBEEF1]
              sm:px-5
            "
          >
            {/* ICON */}

            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#FBEEF1]
                text-[#B5697A]
                transition-all
                duration-200
              "
            >
              <LogOut
                className="h-[17px] w-[17px]"
                strokeWidth={1.8}
              />
            </span>

            {/* TEXT */}

            <span className="min-w-0 flex-1">
              <span
                className="
                  block
                  text-[13px]
                  font-semibold
                  text-[#594D47]
                  transition-colors
                  duration-200
                  group-hover:text-[#B5697A]
                "
              >
                Logout
              </span>

              <span
                className="
                  mt-1
                  block
                  text-[10px]
                  text-[#9A8D84]
                "
              >
                Sign out of your account
              </span>
            </span>

            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[#C6B5AE]
                transition-all
                duration-200
                group-hover:bg-[#FBEEF1]
                group-hover:text-[#B5697A]
              "
            >
              <ArrowRight
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />
            </span>
          </button>
        </section>
      </div>
    </main>
  );
}

export default AccountPage;