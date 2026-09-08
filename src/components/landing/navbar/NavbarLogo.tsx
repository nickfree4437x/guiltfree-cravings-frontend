import { Link } from "react-router-dom";

import logo from "../../../assets/logo.jpg";

interface NavbarLogoProps {
  onClick?: () => void;
  variant?: "dark" | "light";
}

function NavbarLogo({
  onClick,
  variant = "dark",
}: NavbarLogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
      aria-label="GuiltFree Cravings Home"
    >
      {/* =====================================================
          LOGO - Pure transparent for light variant
      ===================================================== */}

      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          transition-all
          sm:h-11
          sm:w-11
          ${isLight 
            ? "border border-white/30 bg-transparent" 
            : "border border-slate-200 bg-white"
          }
        `}
      >
        <img
          src={logo}
          alt="GuiltFree Cravings"
          className="h-full w-full object-cover"
        />
      </div>

      {/* =====================================================
          BRAND NAME - White for light variant
      ===================================================== */}

      <span
        className={`
          whitespace-nowrap
          text-[18px]
          md:text-[24px]
          font-bold
          leading-none
          tracking-[-0.02em]
          transition-colors
          ${isLight ? "text-white" : "text-[#2f2f2f]"}
        `}
      >
        GuiltFree Cravings
      </span>
    </Link>
  );
}

export default NavbarLogo;