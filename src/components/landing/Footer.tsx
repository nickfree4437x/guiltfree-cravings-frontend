import logo from "../../assets/logo.jpg";
import fssaiLogo from "../../assets/fssai-logo.png";
import { Link } from "react-router-dom";

function Footer() {
  const handleSmoothScroll = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    event.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${targetId}`);
  };

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Products", id: "products" },
    { label: "Reviews", id: "reviews" },
  ];

  const customerCareLinks = [
    { label: "Contact Us", id: "contact" },
    { label: "FAQs", id: "faq" },
  ];

  const scrollLinkClass =
    "inline-flex transition-all duration-200 hover:translate-x-0.5 hover:text-white hover:underline";

  const legalLinkClass =
    "inline-flex transition-all duration-200 hover:translate-x-0.5 hover:text-white hover:underline";

  const FssaiBadge = () => (
    <div
      className="
        inline-flex max-w-full items-center gap-3
        rounded-xl border border-white/15 bg-white/[0.06]
        px-3 py-2.5
      "
    >
      <div
        className="
          flex h-10 w-[64px] shrink-0 items-center justify-center
          overflow-hidden rounded-md bg-white px-1.5
        "
      >
        <img
          src={fssaiLogo}
          alt="FSSAI"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.12em] text-white/50">
          FSSAI License
        </p>
        <p className="mt-0.5 whitespace-nowrap font-[350] text-[10px] text-white sm:text-[11px]">
          FSSAI Lic :- #23326006003247
        </p>
      </div>
    </div>
  );

  return (
    <footer className="bg-[#824958] pb-[50px] text-white md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-14 lg:px-10 lg:py-14">
        {/* MAIN FOOTER */}
        <div
          className="
            grid
            gap-12
            md:grid-cols-2
            lg:grid-cols-[1.35fr_0.9fr_0.9fr_1.25fr]
            lg:gap-10
            xl:gap-14
          "
        >
          {/* BRAND */}
          <div>
            <a
              href="/#home"
              aria-label="Guilt Free Cravings Home"
              onClick={(event) => {
                if (window.location.pathname === "/") {
                  handleSmoothScroll(event, "home");
                }
              }}
              className="group inline-flex items-center gap-3"
            >
              <div
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  overflow-hidden rounded-full border border-white/20
                  bg-white shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]
                "
              >
                <img
                  src={logo}
                  alt="Guilt Free Cravings Logo"
                  className="h-full w-full object-cover transition-transform"
                />
              </div>

              <span className="text-[18px] font-semibold tracking-tight text-white md:text-[22px]">
                GuiltFree Cravings
              </span>
            </a>

            <p className="mt-4 max-w-sm text-justify text-[13px] font-[350] leading-relaxed text-white/75 sm:text-[13px]">
              Wholesome homemade laddoos, thoughtfully crafted with simple
              ingredients, traditional care, and a whole lot of love. From our
              kitchen to your home, every bite is made to bring you a little
              more goodness, comfort, and joy.
            </p>
          </div>

          {/* QUICK LINKS + CUSTOMER CARE */}
          <div className="grid grid-cols-2 gap-4 md:contents">
            {/* QUICK LINKS */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-white">
                Quick Links
              </h3>

              <ul className="mt-6 space-y-3 font-[350] text-[12px] text-white/75 sm:text-[13px]">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`/#${link.id}`}
                      onClick={(event) => {
                        if (window.location.pathname === "/") {
                          handleSmoothScroll(event, link.id);
                        }
                      }}
                      className={scrollLinkClass}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* SOCIAL ICONS */}
              <div className="mt-6 flex items-center gap-3">
                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/profile.php?id=61595572672465"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="
                    group flex h-9 w-9 items-center justify-center
                    rounded-full bg-[#1877F2] text-white
                    shadow-sm transition-all duration-300
                    hover:scale-105 hover:shadow-md
                    sm:h-10 sm:w-10
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                    aria-hidden="true"
                  >
                    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
                  </svg>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://instagram.com/guilt.free_cravings?srtk=Ym5yOGxqb3JxYm9k&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="
                    group flex h-9 w-9 items-center justify-center
                    rounded-full text-white shadow-sm
                    transition-all duration-300
                    hover:scale-105 hover:shadow-md
                    sm:h-10 sm:w-10
                  "
                  style={{
                    background:
                      "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CUSTOMER CARE */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-white">
                Customer Care
              </h3>

              <ul className="mt-6 space-y-3 font-[350] text-[12px] text-white/75 sm:text-[13px]">
                {customerCareLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`/#${link.id}`}
                      onClick={(event) => {
                        if (window.location.pathname === "/") {
                          handleSmoothScroll(event, link.id);
                        }
                      }}
                      className={scrollLinkClass}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

                {/* WORKING LEGAL PAGE LINKS */}
                <li>
                  <Link
                    to="/privacy-policy"
                    className={legalLinkClass}
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to="/terms-and-conditions"
                    className={legalLinkClass}
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>

              {/* FSSAI - DESKTOP/TABLET */}
              <div className="mt-7 hidden md:block">
                <FssaiBadge />
              </div>
            </div>

            {/* FSSAI - MOBILE */}
            <div className="col-span-2 md:hidden">
              <FssaiBadge />
            </div>
          </div>

          {/* GET IN TOUCH */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-white">
              Get in Touch
            </h3>

            <div className="mt-6 space-y-5">
              {/* EMAIL */}
              <a
                href="mailto:guiltfreecravings24@gmail.com"
                className="group flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-white/50">
                    Email
                  </span>
                  <span className="mt-1 block text-[12px] font-[350] text-white/85 transition-colors duration-200 group-hover:text-white sm:text-[13px]">
                    guiltfreecravings24@gmail.com
                  </span>
                </span>
              </a>

              {/* PHONE */}
              <a
                href="tel:+919667760119"
                className="group flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>

                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-white/50">
                    Phone
                  </span>
                  <span className="mt-1 block text-[12px] font-[350] text-white/85 transition-colors duration-200 group-hover:text-white sm:text-[13px]">
                    +91-9667760119
                  </span>
                </span>
              </a>

              {/* ADDRESS */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-white/50">
                    Address
                  </span>
                  <span className="mt-1 block text-[12px] font-[350] leading-relaxed text-white/85 sm:text-[12.5px]">
                    RZ-E-60 Chanakya Place Part - 1, DABRI, Janakpuri, West,
                    Delhi-110059
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-4 border-t border-white/15" />

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col gap-3 pt-4 text-[11px] font-[350] sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p className="text-white/60">
            © {new Date().getFullYear()} GuiltFree Cravings. All rights
            reserved.
          </p>

          <p className="font-[350] text-white/50">
            Made with care for every craving.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;