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
      className="flex shrink-0 items-center gap-2"
      aria-label="GuiltFree Cravings Home"
    >
      {/* Logo */}
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
        <img
          src={logo}
          alt="GuiltFree Cravings"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Brand */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`
            font-serif
            text-[16px]
            font-semibold
            tracking-[-0.04em]
            sm:text-[20px]
            ${
              isLight
                ? "text-white"
                : "text-[#315C3A]"
            }
          `}
        >
          Guilt<span className="text-amber-600">Free</span> Cravings
        </span>

        <span
          className="
            mt-1
            text-[8px]
            uppercase
            tracking-[0.08em]
            text-[#B5697A]
            sm:text-[9px]
            font-[500]
          "
        >
          Laddoo Ordering
        </span>
      </div>
    </Link>
  );
}

export default NavbarLogo;