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

      const section = document.getElementById(sectionId);

      if (section) {
        event.preventDefault();

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // URL hash update
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
      <div className="flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={(event) => handleNavigation(event, link.to)}
            className={`
              whitespace-nowrap
              rounded-full
              px-4
              py-2
              text-[13px]
              transition-all
              duration-200
              hover:underline
              xl:px-5
              ${
                isLight
                  ? "text-white hover:text-white"
                  : "text-slate-600 hover:text-[#8b542f]"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DesktopNavigation;