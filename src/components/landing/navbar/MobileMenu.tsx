import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  X,
  Heart,
} from "lucide-react";

import type { NavLink } from "./DesktopNavigation";
import { scrollToSection } from "../../../utils/smoothScroll";

import logo from "../../../assets/logo.jpg";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  displayName: string;
  userInitial: string;
  onClose: () => void;
  onLogout: () => void;
}

function MobileMenu({
  isOpen,
  navLinks,
  onClose,
}: MobileMenuProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  /* ---------------------------------------------
   * BODY SCROLL LOCK
   * --------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /* ---------------------------------------------
   * ESC KEY
   * --------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  /* ---------------------------------------------
   * ACTIVE SECTION TRACKING (hash links)
   * --------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const hashLinks = navLinks.filter((l) => l.to.startsWith("#"));
    if (hashLinks.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current = "";

      for (const link of hashLinks) {
        const id = link.to.substring(1);
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = link.to;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, navLinks]);

  /* ---------------------------------------------
   * CLOSE
   * --------------------------------------------- */
  const handleClose = () => onClose();

  /* ---------------------------------------------
   * NAVIGATION
   * --------------------------------------------- */
  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    to: string,
  ) => {
    if (!to.startsWith("#")) {
      handleClose();
      return;
    }

    event.preventDefault();
    const targetId = to.substring(1);
    handleClose();

    window.setTimeout(() => {
      scrollToSection(targetId);
    }, 180);
  };

  const handleOverlayClick = () => handleClose();

  const handleDrawerClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  /* ---------------------------------------------
   * RENDER
   * --------------------------------------------- */
  return (
    <>
      {/* ================= OVERLAY ================= */}
      <div
        className={`
          fixed inset-0 z-[999]
          bg-gradient-to-br from-[#2B1A1F]/40 via-black/20 to-[#2B1A1F]/40
          backdrop-blur-[4px]
          transition-opacity duration-300
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* ================= DRAWER ================= */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed right-0 top-0 z-[1000]
          flex h-full w-[88%] max-w-[400px] flex-col
          bg-white
          shadow-[-24px_0_70px_rgba(90,50,60,0.22)]
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        onClick={handleDrawerClick}
        aria-hidden={!isOpen}
      >
        {/* ---------- HEADER ---------- */}
        <div
          className="
            relative flex h-[84px] shrink-0 items-center justify-between
            border-b border-[#F0E4D4]
            bg-gradient-to-r from-white via-[#FFFDFB] to-[#FFFCF7]
            px-5
          "
        >

          <div className="relative flex items-center gap-3.5">
            {/* 👇 LOGO — circular for JPG */}
            <div className="relative shrink-0">
              <img
                src={logo}
                alt="GuiltFree Cravings"
                className="
                  h-10 w-10 rounded-full object-cover
                "
                draggable={false}
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  tracking-[0.2em] text-[#A59485]
                "
              >
                GuiltFree
              </p>
              <h2
                className="
                  -mt-0.5 text-[16px] font-bold leading-tight
                  tracking-tight text-[#B5697A]
                "
              >
                Cravings
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="
              group relative flex h-8 w-8 items-center justify-center
              rounded-full border border-[#EFE3D2]
              bg-[#FFFCF7] text-[#6F6259]
              transition-all duration-200
              hover:border-[#B5697A] hover:bg-[#FBEEF1]
              hover:text-[#B5697A]
              active:scale-95
            "
          >
            <X
              size={16}
              strokeWidth={1.9}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* ---------- SCROLLABLE BODY ---------- */}
        <div
          className="
            mobile-menu-scroll
            flex-1 overflow-y-auto px-4 py-3
          "
        >
          {/* NAV LINKS */}
          <div className="space-y-1">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.to;

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(event) => handleNavigation(event, link.to)}
                  style={{
                    transitionDelay: isOpen
                      ? `${80 + index * 40}ms`
                      : "0ms",
                  }}
                  className={`
                    group relative flex min-h-[45px] items-center justify-between
                    overflow-hidden rounded-xl border px-4
                    text-[14px]
                    transition-all duration-300
                    ${
                      isActive
                        ? "border-[#F0D7DD] bg-[#FBEEF1] text-[#B5697A] shadow-sm"
                        : "border-transparent text-[#5E5148] hover:border-[#F0D7DD] hover:bg-[#FBEEF1] hover:text-[#B5697A]"
                    }
                    ${
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-3 opacity-0"
                    }
                  `}
                >

                  <span className="flex items-center gap-2.5 pl-1">
                    {link.label}
                  </span>

                  <ArrowRight
                    size={16}
                    strokeWidth={1.9}
                    className="
                      -translate-x-1 opacity-0
                      transition-all duration-200
                      group-hover:translate-x-0 group-hover:opacity-100
                    "
                  />
                </Link>
              );
            })}
          </div>

          {/* ---------- USER INFO (if logged in) ---------- */}
          {/* {user && (
            <div
              className="
                mt-6 rounded-2xl border border-[#F0E4D4]
                bg-white p-4
                shadow-[0_2px_12px_rgba(181,105,122,0.06)]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-full
                    bg-gradient-to-br from-[#FBEEF1] to-[#F5DCE2]
                    text-[15px] font-bold text-[#B5697A]
                    ring-1 ring-[#F0D7DD]
                  "
                >
                  {userInitial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#4A3F38]">
                    {displayName}
                  </p>
                  {user.email && (
                    <p className="mt-0.5 truncate text-[11px] text-[#8B7A6C]">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* ---------- FOOTER (tagline only) ---------- */}
        <div
          className="
            shrink-0 border-t border-[#F0E4D4]
            bg-gradient-to-t from-white to-[#FFFCF7]
            px-5 py-4
          "
        >
          <div
            className="
              relative overflow-hidden
              rounded-xl border border-[#F0E4D4]
              bg-gradient-to-br from-[#FBEEF1] to-[#FDF6F8]
              px-4 py-3 text-center
            "
          >
            {/* tiny heart accent */}
            <Heart
              size={12}
              strokeWidth={2}
              className="
                mx-auto mb-1 text-[#B5697A]
                fill-[#B5697A]/20
              "
            />

            <p className="text-xs text-[#B5697A]">
              Wholesome goodness,
            </p>
            <p className="mt-0 text-[10px] leading-5 text-[#8B7A6C]">
              made with love for every craving.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- CUSTOM SCROLLBAR (drawer only) ---------- */}
      <style>{`
        .mobile-menu-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .mobile-menu-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .mobile-menu-scroll::-webkit-scrollbar-thumb {
          background: #F0D7DD;
          border-radius: 999px;
        }
        .mobile-menu-scroll::-webkit-scrollbar-thumb:hover {
          background: #E5C2CB;
        }
      `}</style>
    </>
  );
}

export default MobileMenu;