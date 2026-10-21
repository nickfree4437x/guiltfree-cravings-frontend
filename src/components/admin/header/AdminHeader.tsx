import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  LogOut,
  User,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import logo from "../../../assets/logo.jpg";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

import AdminNotifications from "./AdminNotifications";

interface AdminHeaderProps {
  title: string;
  description: string;
  onLogout: () => void;
  onMenuClick: () => void;
}

function AdminHeader({
  onLogout,
  onMenuClick,
}: AdminHeaderProps) {
  const navigate = useNavigate();

  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const profileRef =
    useRef<HTMLDivElement | null>(null);

  const adminInitial =
    admin?.name?.charAt(0)?.toUpperCase() || "A";

  /*
   * =========================================================
   * CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
   * =========================================================
   */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [isProfileOpen]);

  /*
   * =========================================================
   * MY PROFILE
   * =========================================================
   */

  const handleMyProfile = () => {
    setIsProfileOpen(false);

    navigate("/admin/settings");
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    setIsProfileOpen(false);

    onLogout();
  };

  /*
   * =========================================================
   * MOBILE MENU
   * =========================================================
   */

  const handleMenuClick = () => {
    setIsProfileOpen(false);

    onMenuClick();
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-[#EADBD0]
        bg-white
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          min-h-[64px]
          items-center
          justify-between
          gap-3
          px-3
          sm:min-h-[74px]
          sm:gap-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-0.5
            sm:gap-3
          "
        >
          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            onClick={handleMenuClick}
            aria-label="Open admin menu"
            title="Open menu"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              text-[#6F6259]
              hover:text-[#B5697A]
              lg:hidden
            "
          >
            <Menu
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
            "
          >
            {/* Logo */}
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-[#EADBD0]
                bg-white
                sm:h-10
                sm:w-10
              "
            >
              <img
                src={logo}
                alt="GuiltFree Cravings"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>
          </div>

          {/* =================================================
              PAGE INFORMATION
          ================================================= */}

          {/* Brand */}
          <div className="flex flex-col justify-center leading-none">
            <span
              className={`
                
                text-[16px]
                font-bold
                tracking-[-0.04em]
                sm:text-[18px]
                text-gray-600
              `}
            >
              Guilt<span className="text-amber-600">Free</span> Cravings
            </span>

            <span
              className="
                mt-1 ml-0.5
                text-[8px]
                uppercase 
                tracking-[0.08em]
                text-[#B5697A]
                sm:text-[9px]
                font-[350]
              "
            >
              Sweet bhi Health bhi
            </span>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <AdminNotifications />

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className="
              hidden
              h-8
              w-px
              bg-[#EADBD0]
              sm:block
            "
          />

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            {/* Profile Trigger */}
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen(
                  (current) => !current
                )
              }
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className={[
                "flex items-center gap-2",
                "md:rounded-2xl rounded-full border",
                "px-1.5 py-1.5",
                "focus:outline-none",
                isProfileOpen
                  ? "border-[#D9B8C1] bg-[#FDF4F6]"
                  : "border-[#EADBD0] bg-white hover:border-[#D9B8C1] hover:bg-[#FDF4F6]",
              ].join(" ")}
            >
              {/* Avatar */}
              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F8E8EC]
                  text-sm
                  font-semibold
                  text-[#B5697A]
                "
              >
                {adminInitial}
              </span>

              {/* Chevron */}
              <ChevronDown
                className={[
                  "hidden h-4 w-4 text-[#8B7A6C]",
                  "transition-transform duration-200",
                  "sm:block",
                  isProfileOpen
                    ? "rotate-180"
                    : "",
                ].join(" ")}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-52
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#EADBD0]
                  bg-white
                  p-2
                  shadow-md
                "
                role="menu"
              >
                {/* Dropdown Header */}
                <div
                  className="
                    mb-1
                    rounded-xl
                    bg-[#FDF4F6]
                    px-3
                    py-2
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F8E8EC]
                        text-xs
                        font-semibold
                        text-[#B5697A]
                      "
                    >
                      {adminInitial}
                    </span>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-xs
                          text-[#1F4A2E]
                        "
                      >
                        {admin?.name ||
                          "Administrator"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* My Profile */}
                <button
                  type="button"
                  onClick={handleMyProfile}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    text-[#6F6259]
                    transition-all
                    duration-200
                    hover:bg-[#F8E8EC]
                    hover:text-[#B5697A]
                  "
                  role="menuitem"
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#F3F7F1]
                      text-[#1F4A2E]
                    "
                  >
                    <User
                      className="h-3 w-3"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="text-xs">
                    My Profile
                  </span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    text-red-500
                    transition-all
                    duration-200
                    hover:bg-red-50
                    hover:text-red-600
                  "
                  role="menuitem"
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-50
                    "
                  >
                    <LogOut
                      className="h-3 w-3"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="text-xs">
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;