
function CouponsPageHeader() {
  return (
    <header
      className="
        relative
        overflow-hidden
        px-5
        py-10
        sm:px-8
        sm:py-10
        lg:px-10
      "
    >

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative text-center">


        {/* Heading */}
        <h1
          className="
            text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap
          "
        >
          My Coupons
        </h1>

        {/* Description */}
        <p
          className="
            text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[550px] mx-auto text-gray-600
          "
        >
          Discover the offers available for you
          and enjoy a little extra goodness with
          your next order.
        </p>
      </div>
    </header>
  );
}

export default CouponsPageHeader;