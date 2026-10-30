import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../../assets/logo.jpg";
import { useAdminAuthStore } from "../../../store/adminAuthStore";
import AdminNotifications from "./AdminNotifications";

// ─── Types ────────────────────────────────────────────────
interface AdminHeaderProps {
  title: string;
  description: string;
  onLogout: () => void;
  onMenuClick: () => void;
}

// ─── Component ────────────────────────────────────────────
function AdminHeader({ onLogout, onMenuClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const admin = useAdminAuthStore((s) => s.admin);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const adminInitial = admin?.name?.charAt(0)?.toUpperCase() || "A";

  // Close profile on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isProfileOpen]);

  // ─── Handlers ───────────────────────────────────────────
  const handleMyProfile = () => {
    setIsProfileOpen(false);
    navigate("/admin/settings");
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  const handleMenuClick = () => {
    setIsProfileOpen(false);
    onMenuClick();
  };

  const handleLogoClick = () => navigate("/admin/dashboard");

  return (
    <header className="sticky top-0 z-30 border-b border-[#EADBD0] bg-white backdrop-blur-xl">
      <div className="flex min-h-[64px] items-center justify-between gap-3 px-3 sm:min-h-[74px] sm:gap-4 sm:px-6 lg:px-8">
        
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-0.5 sm:gap-3">
          
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label="Open admin menu"
            title="Open menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500 hover:text-[#B5697A] lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </button>

          {/* Brand (Clickable) */}
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Go to admin dashboard"
            title="Go to dashboard"
            className="flex shrink-0 items-center gap-2 rounded-xl text-left transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/30 sm:gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#EADBD0] bg-white sm:h-10 sm:w-10">
              <img src={logo} alt="GuiltFree Cravings" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[16px] font-bold tracking-[-0.04em] text-gray-600 sm:text-[18px]">
                Guilt<span className="text-amber-600">Free</span> Cravings
              </span>
              <span className="mt-1 ml-0.5 text-[9px] uppercase tracking-[0.08em] text-[#B5697A] sm:text-[10px] font-[350]">
                Sweet bhi Health bhi
              </span>
            </div>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <AdminNotifications />

          <div className="hidden h-8 w-px bg-[#EADBD0] sm:block" />

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((c) => !c)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-2 rounded-full border px-1.5 py-1.5 focus:outline-none md:rounded-2xl ${
                isProfileOpen
                  ? "border-[#D9B8C1] bg-[#FDF4F6]"
                  : "border-[#EADBD0] bg-white hover:border-[#D9B8C1] hover:bg-[#FDF4F6]"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8E8EC] text-sm font-semibold text-[#B5697A]">
                {adminInitial}
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-[#8B7A6C] transition-transform duration-200 sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 overflow-hidden rounded-2xl border border-[#EADBD0] bg-white p-2 shadow-md" role="menu">
                {/* Header */}
                <div className="mb-1 rounded-xl bg-[#FDF4F6] px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F8E8EC] text-xs font-semibold text-[#B5697A]">
                      {adminInitial}
                    </span>
                    <p className="truncate text-xs text-[#1F4A2E]">{admin?.name || "Administrator"}</p>
                  </div>
                </div>

                {/* My Profile */}
                <button
                  type="button"
                  onClick={handleMyProfile}
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-500 transition-all duration-200 hover:bg-[#F8E8EC] hover:text-[#B5697A]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3F7F1] text-[#1F4A2E]">
                    <User className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="text-xs">My Profile</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <LogOut className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="text-xs">Logout</span>
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