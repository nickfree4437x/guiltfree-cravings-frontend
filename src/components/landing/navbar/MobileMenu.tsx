import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  X,
} from "lucide-react";

import type { NavLink } from "./DesktopNavigation";

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
  const [, setIsAccountExpanded] = useState(false);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);


  const handleClose = () => {
    setIsAccountExpanded(false);
    onClose();
  };

  // const handleLogout = () => {
  //   setIsAccountExpanded(false);
  //   onLogout();
  // };


  return (
    <>
      <style>
        {`
          @keyframes overlayFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes menuFade {
            from { opacity: 0; transform: translateX(-8px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .overlay-fade { animation: overlayFade 0.25s ease both; }
          .menu-fade   { animation: menuFade 0.4s ease both; }

          @media (prefers-reduced-motion: reduce) {
            .overlay-fade, .menu-fade { animation: none !important; }
          }
        `}
      </style>

      {/* ================= OVERLAY ================= */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`
          fixed inset-0 z-[70] lg:hidden
          bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "overlay-fade opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* ================= DRAWER ================= */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`
          fixed left-0 top-0 bottom-0 z-[80] lg:hidden
          flex w-[85%] max-w-[340px] flex-col
          bg-white
          shadow-sm
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* ================= HEADER ================= */}
        <header className="flex items-center justify-between border-b border-[#EFE3D2] px-4 py-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#B5697A] to-[#8F4F60] text-[13px] text-white shadow-sm">
              G
            </span>
            <div>
              <p className="text-[14px] font-semibold leading-tight text-[#1F4A2E]">
                GuiltFree
              </p>
              <p className="text-[9.5px] uppercase tracking-wide text-[#B5697A]">
                Laddoo Ordering
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              border border-[#EFE3D2] bg-white text-[#5A4A3F]
              transition-all duration-200
              hover:border-[#B5697A]/40 hover:bg-[#FBEEF1] hover:text-[#B5697A]
            "
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto px-3 py-3">

          {/* ============ MAIN NAV ============ */}
          <nav aria-label="Mobile navigation" className="space-y-1">
            {navLinks.map((link, index) => {
              // const Icon = getNavIcon(link.label);

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={handleClose}
                  style={{ animationDelay: `${index * 0.04}s` }}
                  className="
                    menu-fade group flex items-center gap-2 rounded-xl
                    px-3 py-2.5
                    text-[13.5px] text-[#3A2D24]
                    transition-all duration-200 hover:underline
                    hover:bg-white hover:text-[#B5697A] hover:shadow-sm
                  "
                >

                  <span className="flex-1">{link.label}</span>

                  <ArrowRight
                    className="
                      h-3.5 w-3.5 text-[#3A2D24]
                      transition-all duration-200
                      group-hover:translate-x-0.5 group-hover:text-[#B5697A]
                    "
                    strokeWidth={2.2}
                  />
                </Link>
              );
            })}
          </nav>

        </div>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-[#EFE3D2] px-4 py-2.5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A89887]">
            GuiltFree Cravings
          </p>
        </footer>
      </aside>
    </>
  );
}

export default MobileMenu;