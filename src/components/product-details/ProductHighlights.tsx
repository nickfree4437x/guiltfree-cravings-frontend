function ProductHighlights() {
  return (
    <div className="mt-5 grid grid-cols-2 border-y border-[#eadfd3]">
      <div className="border-r border-[#eadfd3] py-4 pr-4 sm:py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Quality
        </p>

        <p className="mt-1.5 text-[14px] md:text-[15px] font-semibold text-[#2c2c2c]">
          Thoughtfully Made
        </p>
      </div>

      <div className="py-4 pl-4 sm:py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Product
        </p>

        <p className="mt-1.5 text-[14px] md:text-[15px] font-semibold text-[#2c2c2c]">
          Freshly Prepared
        </p>
      </div>
    </div>
  );
}

export default ProductHighlights;