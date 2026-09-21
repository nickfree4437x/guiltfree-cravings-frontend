function ProductSkeletonGrid() {
  return (
    <div
      className="
        mx-auto mt-12
        grid gap-5
        sm:grid-cols-2
        lg:grid-cols-4
        lg:gap-6
      "
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
            overflow-hidden
            rounded-2xl
            border border-[#E8E1D8]
            bg-white
          "
        >
          <div
            className="
              h-[250px]
              animate-pulse
              bg-[#F4EEE7]
              sm:h-[270px]
            "
          />

          <div className="space-y-4 p-5">
            <div
              className="
                h-5 w-3/4
                animate-pulse
                rounded
                bg-[#F0E8DF]
              "
            />

            <div
              className="
                h-4 w-1/2
                animate-pulse
                rounded
                bg-[#F0E8DF]
              "
            />

            <div
              className="
                h-4 w-full
                animate-pulse
                rounded
                bg-[#F0E8DF]
              "
            />

            <div
              className="
                h-10 w-full
                animate-pulse
                rounded-xl
                bg-[#F0E8DF]
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductSkeletonGrid;