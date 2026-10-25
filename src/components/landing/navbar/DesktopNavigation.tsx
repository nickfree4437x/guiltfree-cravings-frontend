import { Link } from "react-router-dom";
import type { MouseEvent } from "react";

// ─── Types ────────────────────────────────────────────────
export interface NavLink {
  label: string;
  to: string;
}

interface DesktopNavigationProps {
  navLinks: NavLink[];
  onNavigate: () => void;
  variant?: "dark" | "light";
}

// ─── Component ────────────────────────────────────────────
function DesktopNavigation({
  navLinks,
  onNavigate,
  variant = "dark",
}: DesktopNavigationProps) {
  const isLight = variant === "light";

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    // Same-page hash scroll: /#section → smooth scroll + URL update
    if (to.startsWith("/#")) {
      const sectionId = to.replace("/#", "");
      const section = document.getElementById(sectionId);

      if (section) {
        event.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `/#${sectionId}`);
        onNavigate();
        return;
      }
    }

    // Normal route navigation
    onNavigate();
  };

  return (
    <div className="hidden items-center lg:flex">
      <nav aria-label="Primary navigation" className="flex items-center">
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={(e) => handleNavigation(e, link.to)}
              className={`
                group
                relative
                flex
                items-center
                whitespace-nowrap
                rounded-full
                px-4
                py-2 font-[350]
                text-[13px]
                tracking-[-0.01em]
                transition-all
                duration-200
                xl:px-5
                ${
                  isLight
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:underline hover:text-[#B5697A]"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default DesktopNavigation;