import { Link } from "react-router-dom";

export interface NavLink {
  label: string;
  to: string;
}

interface DesktopNavigationProps {
  navLinks: NavLink[];
  onNavigate: () => void;
  variant?: "dark" | "light";
}

function DesktopNavigation({
  navLinks,
  onNavigate,
  variant = "dark",
}: DesktopNavigationProps) {
  const isLight = variant === "light";

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    to: string
  ) => {
    // =========================
    // SAME PAGE HASH SCROLL
    // =========================
    if (to.startsWith("/#")) {
      const sectionId = to.replace("/#", "");

      const section =
        document.getElementById(sectionId);

      if (section) {
        event.preventDefault();

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // URL hash update
        window.history.pushState(
          null,
          "",
          `/#${sectionId}`
        );

        onNavigate();
        return;
      }
    }

    // Normal route navigation
    onNavigate();
  };

  return (
    <div className="hidden items-center lg:flex">
      <nav
        aria-label="Primary navigation"
        className="flex items-center"
      >
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={(event) =>
                handleNavigation(
                  event,
                  link.to
                )
              }
              className={`
                group
                relative
                flex
                items-center
                whitespace-nowrap
                rounded-full
                px-4
                py-2
                text-[14px]
                tracking-[-0.01em]
                transition-all
                duration-200
                xl:px-5
                ${
                  isLight
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:bg-[#B5697A]/10 hover:text-[#B5697A]"
                }
              `}
            >
              {link.label}

              {/* Subtle active/hover accent */}
              <span
                className={`
                  absolute
                  bottom-[4px]
                  left-1/2
                  -translate-x-1/2
                  rounded-full
                  transition-all
                  duration-200
                  group-hover:w-5
                  ${
                    isLight
                      ? "bg-white"
                      : "bg-[#B5697A]"
                  }
                `}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default DesktopNavigation;