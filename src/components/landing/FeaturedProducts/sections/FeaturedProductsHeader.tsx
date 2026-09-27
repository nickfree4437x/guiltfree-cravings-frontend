function FeaturedProductsHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2
        className="
          mb-2
          text-[20px]
          font-semibold
          leading-snug
          tracking-wide
          text-[#C9788B]
          sm:text-[24px]
          md:mb-3
          md:text-[28px]
          md:whitespace-nowrap
        "
      >
        Our Laddoos
      </h2>

      <p
        className="
          mx-auto
          max-w-[650px]
          text-[12.5px]
          leading-relaxed
          tracking-wide
          text-[#2C2C2C]
          sm:text-[13.5px]
          md:text-[14px]
        "
      >
        Thoughtfully crafted homemade
        laddoos with comforting flavours,
        wholesome ingredients, and a
        whole lot of love.
      </p>
    </div>
  );
}

export default FeaturedProductsHeader;