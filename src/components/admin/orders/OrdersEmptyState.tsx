// src/components/admin/orders/OrdersEmptyState.tsx

import {
  ClipboardList,
  SearchX,
} from "lucide-react";

interface OrdersEmptyStateProps {
  hasSearch: boolean;
  onClearSearch: () => void;
}

function OrdersEmptyState({
  hasSearch,
  onClearSearch,
}: OrdersEmptyStateProps) {
  return (
    <div className="flex min-h-[300px] items-center justify-center px-6 py-12 text-center sm:px-10">

      <div className="max-w-md">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
          {hasSearch ? (
            <SearchX
              className="h-7 w-7"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          ) : (
            <ClipboardList
              className="h-7 w-7"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          )}
        </div>

        <h3 className="mt-5 text-[17px] font-semibold text-[#1F4A2E]">
          {hasSearch
            ? "No Matching Orders"
            : "No Orders Yet"}
        </h3>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#8B7A6C]">
          {hasSearch
            ? "No orders match your current search or filters. Try adjusting your filters."
            : "Customer orders will appear here once orders are created."}
        </p>

        {hasSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#B5697A] px-5 text-[12px] text-white hover:bg-[#A85F70]"
          >
            Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}

export default OrdersEmptyState;