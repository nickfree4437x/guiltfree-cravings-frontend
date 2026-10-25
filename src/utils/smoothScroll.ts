import type { NavigateFunction } from "react-router-dom";

export const scrollToSection = (
  targetId: string,
  navigate?: NavigateFunction
) => {
  const cleanId = targetId.replace(/^#/, "");

  const scroll = () => {
    const target = document.getElementById(cleanId);

    if (!target) {
      console.warn(`Smooth scroll target not found: #${cleanId}`);
      return;
    }

    // Offset for mobile fixed navbar (50px)
    const navbarOffset = 50;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `#${cleanId}`);
  };

  // Target exists on current page
  if (document.getElementById(cleanId)) {
    scroll();
    return;
  }

  // Target missing → navigate to home first, then scroll
  if (navigate) {
    navigate(`/#${cleanId}`);
    window.setTimeout(scroll, 250);
  }
};