import logo from "../../assets/logo.jpg";
import fssaiLogo from "../../assets/fssai-logo.png";

function Footer() {
  return (
    <footer className="bg-[#824958] pb-[50px] text-white md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-[68px]">
        {/* =========================================================
            MAIN FOOTER
        ========================================================= */}
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
          {/* =====================================================
              BRAND
          ===================================================== */}
          <div>
            <a
              href="#home"
              aria-label="Guilt Free Cravings Home"
              className="group inline-flex items-center gap-3"
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-white/20
                  bg-white
                  shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]
                "
              >
                <img
                  src={logo}
                  alt="Guilt Free Cravings Logo"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />
              </div>

              <span className="text-[18px] md:text-[22px] font-semibold tracking-tight text-white">
                GuiltFree Cravings
              </span>
            </a>

            <p
              className="
                mt-4
                max-w-sm
                text-[13px]
                leading-6
                text-white/75
                sm:text-sm
                text-justify
              "
            >
              Wholesome homemade laddoos, thoughtfully crafted with simple ingredients, traditional care, 
              and a whole lot of love. From our kitchen to your home, every bite is made to bring you a little more goodness, comfort, and joy.
            </p>

            {/* Brand accent */}
            <div className="mt-6 flex items-center gap-2">
              <span className="h-px w-8 bg-white/30" />
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span className="h-px w-12 bg-white/15" />
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}
          <div>
            <h3
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Quick Links
            </h3>

            <ul className="mt-6 space-y-3.5 text-[13px] text-white/75 sm:text-sm">
              <li>
                <a
                  href="#home"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white hover:underline
                  "
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="#products"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  Products
                </a>
              </li>

              <li>
                <a
                  href="#vision"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* =====================================================
              CUSTOMER CARE
          ===================================================== */}
          <div>
            <h3
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Customer Care
            </h3>

            <ul className="mt-6 space-y-3.5 text-[13px] text-white/75 sm:text-sm">
              <li>
                <a
                  href="#contact"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  FAQs
                </a>
              </li>

              <li>
                <a
                  href="#privacy"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#terms"
                  className="
                    inline-flex
                    transition-all
                    duration-200
                    hover:translate-x-0.5
                    hover:text-white
                    hover:underline
                  "
                >
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>

            {/* FSSAI */}
            <div
              className="
                mt-7
                inline-flex
                max-w-full
                items-center
                gap-3
                rounded-xl
                border
                border-white/15
                bg-white/[0.06]
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-[64px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-md
                  bg-white
                  px-1.5
                "
              >
                <img
                  src={fssaiLogo}
                  alt="FSSAI"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-white/50
                  "
                >
                  FSSAI License
                </p>

                <p
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-[10px]
                    text-white
                    sm:text-[11px]
                  "
                >
                  FSSAI Lic :- #10823999000142
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              GET IN TOUCH
          ===================================================== */}
          <div>
            <h3
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Get in Touch
            </h3>

            <div className="mt-6 space-y-5">
              {/* EMAIL */}
              <a
                href="mailto:hello@guiltfreecravings.com"
                className="group flex items-start gap-3"
              >
                <span
                  className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                  "
                >
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
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <span>
                  <span
                    className="
                      block
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-white/50
                    "
                  >
                    Email
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[13px]
                      text-white/85
                      transition-colors
                      duration-200
                      group-hover:text-white
                      sm:text-sm
                    "
                  >
                    hello@guiltfreecravings.com
                  </span>
                </span>
              </a>

              {/* PHONE */}
              <a
                href="tel:+91XXXXXXXXXX"
                className="group flex items-start gap-3"
              >
                <span
                  className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                  "
                >
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
                  <span
                    className="
                      block
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-white/50
                    "
                  >
                    Phone
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[13px]
                      text-white/85
                      transition-colors
                      duration-200
                      group-hover:text-white
                      sm:text-sm
                    "
                  >
                    +91 XXXXX XXXXX
                  </span>
                </span>
              </a>

              {/* ADDRESS */}
              <div className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                  "
                >
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
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>
                </span>

                <span>
                  <span
                    className="
                      block
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-white/50
                    "
                  >
                    Address
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[13px]
                      leading-5
                      text-white/85
                      sm:text-sm
                    "
                  >
                    Dwarka Delhi, India
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            DIVIDER
        ========================================================= */}
        <div className="mt-8 border-t border-white/15" />

        {/* =========================================================
            BOTTOM FOOTER
        ========================================================= */}
        <div
          className="
            flex
            flex-col
            gap-3
            pt-6
            text-[11px]
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-xs
          "
        >
          <p className="text-white/60">
            © {new Date().getFullYear()} Guilt Free Cravings. All rights
            reserved.
          </p>

          <p className="text-white/60">
            Made with care for every craving.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;