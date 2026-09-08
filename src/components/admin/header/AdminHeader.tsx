// src/components/admin/header/AdminHeader.tsx

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.jpg";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

interface AdminHeaderProps {
  title: string;
  description: string;
  onLogout: () => void;
}

function AdminHeader({
  title,
  description,
  onLogout,
}: AdminHeaderProps) {
  const navigate = useNavigate();

  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const profileRef = useRef<HTMLDivElement | null>(
    null
  );

  const adminInitial =
    admin?.name?.charAt(0)?.toUpperCase() || "A";

  /*
   * =========================================================
   * CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
   * =========================================================
   */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
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

  return (
    <header className="sticky top-0 z-30 border-b border-[#eadfd3] bg-white backdrop-blur-md">
      <div className="flex min-h-[76px] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="flex min-w-0 items-center gap-5">

          {/* Brand */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[#eadfd3]">
                <img
                    src={logo}
                    alt="GuiltFree Cravings"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b542f]">
                GuiltFree
              </p>

              <p className="-mt-0.5 text-[12px] text-slate-700">
                Cravings
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-9 w-px bg-[#eadfd3] md:block" />

          {/* Page Information */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b542f] md:block">
                Admin
              </span>

              <span className="hidden text-slate-300 md:block">
                /
              </span>

              <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {title}
              </h1>
            </div>

            <p className="mt-1 hidden max-w-xl truncate text-xs text-slate-400 md:block">
              {description}
            </p>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-slate-500 transition hover:bg-[#fffaf5] hover:text-[#8b542f] focus:outline-none focus:ring-2 focus:ring-[#8b542f]/20"
          >
            <Bell
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {/* Notification Dot */}
            <span
              className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#8b542f]"
              aria-hidden="true"
            />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#eadfd3] sm:block" />

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
              className={`flex items-center gap-2.5 rounded-2xl px-1.5 py-1.5 border border:ring-[#8b542f]/20 transition focus:outline-none ${
                isProfileOpen
                  ? "bg-[#fffaf5]"
                  : "hover:bg-[#fffaf5]"
              }`}
            >
              {/* Avatar */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3e4d3] text-sm font-semibold text-[#8b542f]">
                {adminInitial}
              </span>

              {/* Details */}
              <span className="hidden min-w-0 text-left sm:block">


              </span>

              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${
                  isProfileOpen
                    ? "rotate-180"
                    : ""
                }`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 overflow-hidden rounded-xl border border-[#eadfd3] bg-white p-2 shadow-md"
                role="menu"
              >

                {/* My Profile */}
                <button
                  type="button"
                  onClick={handleMyProfile}
                  className="mt-1.5 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                  role="menuitem"
                >
                  <span className="flex h-7 w-7 items-center justify-center text-[#8b542f]">
                    <User
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <span>My Profile</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  role="menuitem"
                >
                  <span className="flex h-7 w-7 items-center justify-center">
                    <LogOut
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <span>Logout</span>
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