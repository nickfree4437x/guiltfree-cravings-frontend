// src/components/admin/orders/OrdersToolbar.tsx

interface OrdersToolbarProps {
  search: string;
  filteredCount: number;
  onSearchChange: (
    value: string
  ) => void;
}

function OrdersToolbar({
  search,
  filteredCount,
  onSearchChange,
}: OrdersToolbarProps) {
  return (
    <div className="border-b border-[#eadfd3] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            All Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredCount} order
            {filteredCount !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:max-w-sm">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search order or customer..."
            className="w-full rounded-xl border border-[#d9c7b7] bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3]"
          />
        </div>

      </div>
    </div>
  );
}

export default OrdersToolbar;