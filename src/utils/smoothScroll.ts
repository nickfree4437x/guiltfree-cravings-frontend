import type { NavigateFunction } from "react-router-dom";

export const scrollToSection = (
  targetId: string,
  navigate?: NavigateFunction,
) => {
  const cleanId = targetId.replace(/^#/, "");

  const scroll = () => {
    const target =
      document.getElementById(cleanId);

    if (!target) {
      console.warn(
        `Smooth scroll target not found: #${cleanId}`,
      );
      return;
    }

    /*
     * Mobile fixed navbar + section top spacing.
     *
     * Navbar is around 80px high and the section
     * itself has additional top spacing.
     *
     * 120px brings the actual section content
     * much closer to the top of the viewport.
     */

    const navbarOffset = 50;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      `#${cleanId}`,
    );
  };

  /*
   * Target already exists on current page
   */
  if (document.getElementById(cleanId)) {
    scroll();
    return;
  }

  /*
   * Target doesn't exist → go to home first
   */
  if (navigate) {
    navigate(`/#${cleanId}`);

    window.setTimeout(() => {
      scroll();
    }, 250);
  }
};