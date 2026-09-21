function ProductEmptyState() {
  return (
    <div
      className="
        mx-auto mt-10
        max-w-2xl
        rounded-xl
        border border-[#E8E1D8]
        bg-white
        px-6 py-12
        text-center
      "
    >
      <h3
        className="
          text-xl
          font-semibold
          text-[#245538]
        "
      >
        No products available
      </h3>

      <p
        className="
          mt-3
          text-sm
          text-slate-500
        "
      >
        Please check back soon
        for our latest cravings.
      </p>
    </div>
  );
}

export default ProductEmptyState;