// ─── Skeleton bar configs ─────────────────────────────────
const BARS = [
  { height: "h-5", width: "w-3/4" },
  { height: "h-4", width: "w-1/2" },
  { height: "h-4", width: "w-full" },
  { height: "h-10", width: "w-full", rounded: "rounded-xl" },
];

// ─── Component ────────────────────────────────────────────
function ProductSkeletonGrid() {
  return (
    <div className="mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-xl border border-[#E8E1D8] bg-white"
        >
          {/* Image skeleton */}
          <div className="h-[250px] animate-pulse bg-[#F4EEE7] sm:h-[270px]" />

          {/* Text + button skeletons */}
          <div className="space-y-4 p-5">
            {BARS.map((bar, i) => (
              <div
                key={i}
                className={`${bar.height} ${bar.width} animate-pulse rounded ${bar.rounded || ""} bg-[#F0E8DF]`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductSkeletonGrid;