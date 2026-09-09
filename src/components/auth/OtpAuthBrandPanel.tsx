import heroImage from "../../assets/hero_image.png";

function OtpAuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-full w-[42%] overflow-hidden bg-[#8b542f] lg:flex">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/10" />

      <div className="absolute right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[#f3e4d3]/10 blur-2xl" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-12">
        {/* BRAND */}

        <div>
          <div className="mt-12 max-w-sm">
            <h2 className="mt-4 text-[18px] font-semibold leading-[1.08] tracking-tight text-white md:text-[28px]">
              Login
            </h2>

            <p className="mt-4 max-w-xs text-[12px] font-[350] leading-5 text-white/75 md:text-[14.5px]">
              Sign in securely with your mobile number to continue your shopping journey
            </p>
          </div>
        </div>

        {/* ===================================================
            PRODUCT VISUAL
        ==================================================== */}

        <div className="relative mt-32 flex flex-1 items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-[#f3e4d3]/20 blur-[1px]" />

          <div className="relative w-full max-w-[360px]">
            <img
              src={heroImage}
              alt="GuiltFree Cravings wholesome products"
              className="mx-auto max-h-[280px] w-full rounded-lg object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default OtpAuthBrandPanel;