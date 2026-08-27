function Footer() {
  return (
    <footer className="bg-[#2f2119] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2f2119]">
                GC
              </div>

              <span className="text-lg font-bold">
                Guilt Free Cravings
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#d8c8bd]">
              Delicious treats thoughtfully made for your everyday cravings
              and special moments.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6b5547] text-xs font-semibold transition hover:bg-white hover:text-[#2f2119]"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6b5547] text-xs font-semibold transition hover:bg-white hover:text-[#2f2119]"
              >
                FB
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6b5547] text-xs font-semibold transition hover:bg-white hover:text-[#2f2119]"
              >
                WA
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-[#d8c8bd]">
              <li>
                <a href="#home" className="transition hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="#about" className="transition hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="#products" className="transition hover:text-white">
                  Products
                </a>
              </li>

              <li>
                <a href="#vision" className="transition hover:text-white">
                  Our Vision
                </a>
              </li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Customer Care
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-[#d8c8bd]">
              <li>
                <a href="#" className="transition hover:text-white">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  FAQs
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-3 text-sm text-[#d8c8bd]">
              <p>
                Email: hello@guiltfreecravings.com
              </p>

              <p>
                Phone: +91 XXXXX XXXXX
              </p>

              <p>
                Delhi, India
              </p>
            </div>

            <button
              type="button"
              className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#2f2119] transition hover:bg-[#fff5ec]"
            >
              Shop Now
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-[#5a463a]" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-3 pt-6 text-sm text-[#bdaea4] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Guilt Free Cravings. All rights reserved.
          </p>

          <p>
            Made with care for every craving.
          </p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;