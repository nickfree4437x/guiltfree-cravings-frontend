import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { X, Heart } from "lucide-react";

import type { NavLink } from "./DesktopNavigation";
import { scrollToSection } from "../../../utils/smoothScroll";
import logo from "../../../assets/logo.jpg";

// ─── Types ────────────────────────────────────────────────
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

// ─── Active Section Resolver ──────────────────────────────
// Returns the `to` value of the section currently under the
// activation line, or "" if none are tracked.
function resolveActiveSection(links: NavLink[]): string {
  const hashLinks = links.filter((l) => l.to.startsWith("#") && l.to.length > 1);
  if (hashLinks.length === 0) return "";

  const sections = hashLinks
    .map((l) => {
      const el = document.getElementById(l.to.slice(1));
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { to: l.to, top: rect.top, bottom: rect.bottom };
    })
    .filter((s): s is { to: string; top: number; bottom: number } => s !== null);

  if (sections.length === 0) return "";

  // Near the top, first section wins.
  if (window.scrollY < 50) return sections[0].to;

  const LINE = 140;

  // Section crossing the activation line.
  const current = sections.find((s) => s.top <= LINE && s.bottom > LINE);
  if (current) return current.to;

  // Most recently passed section.
  const passed = sections.filter((s) => s.top <= LINE);
  if (passed.length > 0) return passed[passed.length - 1].to;

  // Before the first section.
  return sections[0].to;
}

// ─── Component ────────────────────────────────────────────
function MobileMenu({ isOpen, navLinks, onClose }: MobileMenuProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Escape key close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Track active section while scrolling
  useEffect(() => {
    let rafId = 0;
    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setActiveSection(resolveActiveSection(navLinks)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, [navLinks, isOpen]);

  // Handlers
  const handleClose = () => onClose();

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    if (!to.startsWith("#")) { handleClose(); return; }
    event.preventDefault();
    setActiveSection(to);
    handleClose();
    window.setTimeout(() => scrollToSection(to.substring(1)), 180);
  };

  const handleOverlayClick = () => handleClose();
  const handleDrawerClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  // ─── Render ─────────────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-gradient-to-br from-[#2B1A1F]/40 via-black/20 to-[#2B1A1F]/40 backdrop-blur-[4px] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 z-[1000] flex h-full w-[88%] max-w-[400px] flex-col bg-white shadow-[-24px_0_70px_rgba(90,50,60,0.22)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={handleDrawerClick}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="relative flex h-[84px] shrink-0 items-center justify-between border-b border-[#F0E4D4] bg-gradient-to-r from-white via-[#FFFDFB] to-[#FFFCF7] px-5">
          <div className="relative flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img src={logo} alt="GuiltFree Cravings" className="h-10 w-10 rounded-full object-cover" draggable={false} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] text-gray-500">GuiltFree</p>
              <h2 className="-mt-0.5 text-[16px] font-bold leading-tight tracking-tight text-[#B5697A]">Cravings</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-[#EFE3D2] bg-[#FFFCF7] text-[#6F6259] transition-all duration-200 hover:border-[#B5697A] hover:bg-[#FBEEF1] hover:text-[#B5697A]"
          >
            <X size={16} strokeWidth={1.9} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="mobile-menu-scroll flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-1">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => handleNavigation(e, link.to)}
                  aria-current={isActive ? "location" : undefined}
                  style={{ transitionDelay: isOpen ? `${80 + index * 40}ms` : "0ms" }}
                  className={`group relative flex min-h-[40px] items-center justify-between overflow-hidden rounded-xl border px-4 text-[13px] font-[350] transition-all duration-300 ${
                    isActive
                      ? "border-[#F0D7DD] bg-[#FBEEF1] text-[#B5697A] shadow-sm"
                      : "border-transparent text-gray-600 hover:border-[#F0D7DD] hover:bg-[#FBEEF1] hover:text-[#B5697A]"
                  } ${isOpen ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`}
                >
                  <span className="flex items-center gap-2.5 pl-1">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#F0E4D4] bg-gradient-to-t from-white to-[#FFFCF7] px-5 py-4">
          <div className="relative overflow-hidden rounded-xl border border-[#F0E4D4] bg-gradient-to-br from-[#FBEEF1] to-[#FDF6F8] px-4 py-3 text-center">
            <Heart size={12} strokeWidth={2} className="mx-auto mb-1 text-[#B5697A] fill-[#B5697A]/20" />
            <p className="text-xs text-[#B5697A]">Wholesome goodness,</p>
            <p className="mt-0 text-[10px] leading-5 text-[#8B7A6C]">made with love for every craving.</p>
          </div>
        </div>
      </div>

      {/* Custom scrollbar */}
      <style>{`
        .mobile-menu-scroll::-webkit-scrollbar { width: 6px; }
        .mobile-menu-scroll::-webkit-scrollbar-track { background: transparent; }
        .mobile-menu-scroll::-webkit-scrollbar-thumb { background: #F0D7DD; border-radius: 999px; }
        .mobile-menu-scroll::-webkit-scrollbar-thumb:hover { background: #E5C2CB; }
      `}</style>
    </>
  );
}

export default MobileMenu;