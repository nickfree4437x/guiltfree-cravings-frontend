function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">

        <div className="h-4 w-32 rounded-full bg-[#eadfd3]" />

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-[#eadfd3] bg-[#f8eee4] sm:min-h-[480px] lg:min-h-[560px]">
            <div className="h-3/4 w-3/4 rounded-2xl bg-[#eadfd3]" />
          </div>

          <div className="pt-2">
            <div className="h-3 w-36 rounded-full bg-[#eadfd3]" />

            <div className="mt-5 h-12 w-4/5 rounded-xl bg-[#eadfd3]" />

            <div className="mt-5 h-8 w-28 rounded-lg bg-[#eadfd3]" />

            <div className="my-7 h-px bg-[#eadfd3]" />

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-[#eadfd3]" />
              <div className="h-4 w-full rounded bg-[#eadfd3]" />
              <div className="h-4 w-4/5 rounded bg-[#eadfd3]" />
            </div>

            <div className="mt-7 h-20 rounded-xl bg-[#eadfd3]" />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="h-28 rounded-xl bg-[#eadfd3]" />
              <div className="h-28 rounded-xl bg-[#eadfd3]" />
              <div className="h-28 rounded-xl bg-[#eadfd3]" />
            </div>

            <div className="mt-8 h-14 w-44 rounded-full bg-[#eadfd3]" />

            <div className="mt-6 h-20 rounded-xl bg-[#eadfd3]" />

            <div className="mt-7 h-14 w-full rounded-full bg-[#eadfd3]" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsSkeleton;