// src/components/admin/orders/OrdersEmptyState.tsx

interface OrdersEmptyStateProps {
  hasSearch: boolean;
  onClearSearch: () => void;
}

function OrdersEmptyState({
  hasSearch,
  onClearSearch,
}: OrdersEmptyStateProps) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No orders found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSearch
          ? "No orders match your search. Try a different order number, customer name, or phone number."
          : "Customer orders will appear here once orders are created."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#744324]"
        >
          Clear Search
        </button>
      )}

    </div>
  );
}

export default OrdersEmptyState;