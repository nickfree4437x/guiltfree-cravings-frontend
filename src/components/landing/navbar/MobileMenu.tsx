import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Info,
  Star,
  HelpCircle,
  User as UserIcon,
  Package,
  Heart,
  Tag,
  LogOut,
  ChevronDown,
  ArrowRight,
  X,
} from "lucide-react";

import type { NavLink } from "./DesktopNavigation";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  isAuthenticated: boolean;
  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  displayName: string;
  userInitial: string;
  onClose: () => void;
  onLogout: () => void;
  variant?: "dark" | "light";
}

function MobileMenu({
  isOpen,
  navLinks,
  isAuthenticated,
  user,
  displayName,
  userInitial,
  onClose,
  onLogout,
  variant = "light",
}: MobileMenuProps) {
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const isLight = variant === "light";

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleAccountToggle = () => {
    setIsAccountExpanded((current) => !current);
  };

  const handleClose = () => {
    setIsAccountExpanded(false);
    onClose();
  };

  const handleLogout = () => {
    setIsAccountExpanded(false);
    onLogout();
  };

  const getNavIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("home")) return Home;
    if (lower.includes("shop") || lower.includes("laddoo") || lower.includes("product"))
      return ShoppingBag;
    if (lower.includes("about")) return Info;
    if (lower.includes("craft") || lower.includes("behind")) return Star;
    if (lower.includes("review")) return Star;
    if (lower.includes("support") || lower.includes("faq")) return HelpCircle;
    return ArrowRight;
  };

  const accountLinks = [
    { to: "/profile", label: "My Profile", icon: UserIcon },
    { to: "/orders", label: "My Orders", icon: Package },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/coupons", label: "Coupons", icon: Tag },
  ];

  return (
    <>
      <style>
        {`
          @keyframes overlayFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes drawerSlide {
            from { transform: translateX(-100%); }
            to   { transform: translateX(0); }
          }
          @keyframes menuFade {
            from { opacity: 0; transform: translateX(-8px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .overlay-fade { animation: overlayFade 0.25s ease both; }
          .drawer-slide { animation: drawerSlide 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .menu-fade   { animation: menuFade 0.4s ease both; }

          @media (prefers-reduced-motion: reduce) {
            .overlay-fade, .drawer-slide, .menu-fade { animation: none !important; }
          }
        `}
      </style>

      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`
          fixed inset-0 z-[70] lg:hidden
          bg-black/45 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "overlay-fade opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`
          fixed left-0 top-0 bottom-0 z-[80] lg:hidden
          flex w-[85%] max-w-[340px] flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${
            isLight
              ? "bg-[#FBF6EE] border-r border-[#EFE3D2]"
              : "bg-[#1a1a1a] border-r border-white/10"
          }
        `}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <header
          className={`
            flex items-center justify-between px-4 py-4 border-b
            ${isLight ? "border-[#EFE3D2]" : "border-white/10"}
          `}
        >
          <div className="flex items-center gap-2">
            <span
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full bg-gradient-to-br from-[#C9788B] to-[#A55F70]
                text-[12px] font-semibold text-white shadow-md shadow-[#C9788B]/30
              "
            >
              G
            </span>
            <span
              className={`font-display text-[15px] font-semibold ${
                isLight ? "text-[#3A2D24]" : "text-white"
              }`}
            >
              Menu
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className={`
              flex h-9 w-9 items-center justify-center rounded-full
              transition-all duration-200 active:scale-90
              ${
                isLight
                  ? "bg-white text-[#5A4A3F] shadow-sm hover:bg-[#F5E9D8]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <nav aria-label="Mobile navigation" className="space-y-1">
            {navLinks.map((link, index) => {
              const Icon = getNavIcon(link.label);

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={handleClose}
                  style={{ animationDelay: `${index * 0.04}s` }}
                  className={`
                    menu-fade group flex items-center gap-3 rounded-xl px-3 py-3
                    text-[13.5px] font-medium transition-all duration-200
                    ${
                      isLight
                        ? "text-[#3A2D24] hover:bg-white hover:text-[#C9788B] hover:shadow-sm"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg
                      transition-colors duration-200
                      ${
                        isLight
                          ? "bg-[#F5E9D8] text-[#8B6F5C] group-hover:bg-[#C9788B]/15 group-hover:text-[#C9788B]"
                          : "bg-white/5 text-white/60 group-hover:bg-white/15 group-hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>

                  <span className="flex-1">{link.label}</span>

                  <ArrowRight
                    className={`
                      h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5
                      ${isLight ? "text-[#C9B5A0]" : "text-white/30"}
                    `}
                    strokeWidth={2.2}
                  />
                </Link>
              );
            })}
          </nav>

          {isAuthenticated ? (
            <div
              className={`
                mt-4 overflow-hidden rounded-2xl border
                ${
                  isLight
                    ? "border-[#EFE3D2] bg-white shadow-[0_2px_12px_rgba(139,111,92,0.06)]"
                    : "border-white/15 bg-white/5"
                }
              `}
            >
              <button
                type="button"
                onClick={handleAccountToggle}
                aria-expanded={isAccountExpanded}
                aria-controls="mobile-account-links"
                className={`
                  flex w-full items-center justify-between gap-3 px-3 py-3 text-left
                  transition-all duration-200
                  ${isLight ? "hover:bg-[#FBF6EE]" : "hover:bg-white/5"}
                `}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="
                      flex h-10 w-10 flex-shrink-0 items-center justify-center
                      rounded-full bg-gradient-to-br from-[#C9788B] to-[#A55F70]
                      text-[13px] font-semibold text-white shadow-md shadow-[#C9788B]/30
                    "
                  >
                    {userInitial}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-[13.5px] font-semibold ${
                        isLight ? "text-[#3A2D24]" : "text-white"
                      }`}
                    >
                      {displayName}
                    </p>
                    <p
                      className={`mt-0.5 truncate text-[11px] ${
                        isLight ? "text-[#8B7A6C]" : "text-white/50"
                      }`}
                    >
                      {user?.email || user?.phone || ""}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    flex h-8 w-8 flex-shrink-0 items-center justify-center
                    rounded-full transition-all duration-300
                    ${
                      isLight
                        ? "bg-[#FBF6EE] text-[#8B7A6C]"
                        : "bg-white/10 text-white/60"
                    }
                    ${isAccountExpanded ? "rotate-180 bg-[#C9788B]/15 text-[#C9788B]" : ""}
                  `}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </button>

              <div
                id="mobile-account-links"
                className={`
                  grid transition-all duration-300 ease-in-out
                  ${
                    isAccountExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-0.5 px-2 pb-2 pt-1">
                    {accountLinks.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={handleClose}
                          className={`
                            group flex items-center gap-3 rounded-xl px-3 py-2.5
                            text-[12.5px] font-medium transition-all duration-200
                            ${
                              isLight
                                ? "text-[#5A4A3F] hover:bg-[#FBF6EE] hover:text-[#C9788B]"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          <span
                            className={`
                              flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg
                              transition-colors duration-200
                              ${
                                isLight
                                  ? "bg-[#FBF6EE] text-[#8B6F5C] group-hover:bg-[#C9788B]/15 group-hover:text-[#C9788B]"
                                  : "bg-white/5 text-white/50 group-hover:bg-white/15 group-hover:text-white"
                              }
                            `}
                          >
                            <ItemIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          </span>
                          {item.label}
                        </Link>
                      );
                    })}

                    <div
                      className={`my-1.5 border-t ${
                        isLight ? "border-[#EFE3D2]" : "border-white/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`
                        group flex w-full items-center gap-3 rounded-xl px-3 py-2.5
                        text-left text-[12.5px] font-medium transition-all duration-200
                        ${
                          isLight
                            ? "text-red-500 hover:bg-red-50"
                            : "text-red-400 hover:bg-red-500/10"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex h-7 w-7 items-center justify-center rounded-lg transition-colors
                          ${
                            isLight
                              ? "bg-red-50 text-red-500 group-hover:bg-red-100"
                              : "bg-red-500/10 text-red-400 group-hover:bg-red-500/20"
                          }
                        `}
                      >
                        <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={handleClose}
              className="
                mt-4 flex items-center justify-center gap-2 rounded-xl
                bg-[#C9788B] px-5 py-3 text-[13.5px] font-semibold text-white
                shadow-lg shadow-[#C9788B]/25 transition-all duration-200
                hover:-translate-y-0.5 hover:bg-[#B8687B] hover:shadow-xl hover:shadow-[#C9788B]/40
                active:scale-[0.99]
              "
            >
              Login to your account
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          )}
        </div>

        <footer
          className={`
            border-t px-4 py-3 text-center
            ${isLight ? "border-[#EFE3D2]" : "border-white/10"}
          `}
        >
          <p
            className={`text-[10px] uppercase tracking-[0.2em] ${
              isLight ? "text-[#A89887]" : "text-white/40"
            }`}
          >
            GuiltFree Cravings
          </p>
        </footer>
      </aside>
    </>
  );
}

export default MobileMenu;