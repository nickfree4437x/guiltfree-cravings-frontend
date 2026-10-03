function MyOrdersHeader() {
  return (
    <header className="text-center">

      <h1 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap">
        My Orders
      </h1>

      <p className="text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-600">
        View your previous orders, check their current
        status, and keep track of everything you've
        purchased from us.
      </p>

    </header>
  );
}

export default MyOrdersHeader;