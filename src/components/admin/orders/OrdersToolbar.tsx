import { Search, X, ChevronDown } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "./types";

interface OrdersToolbarProps {
  search: string;
  filteredCount: number;
  totalCount: number;
  orderStatus: OrderStatus | "";
  paymentStatus: PaymentStatus | "";
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onOrderStatusChange: (value: OrderStatus | "") => void;
  onPaymentStatusChange: (value: PaymentStatus | "") => void;
  onClearFilters: () => void;
}

function OrdersToolbar({
  search,
  orderStatus,
  paymentStatus,
  hasActiveFilters,
  onSearchChange,
  onOrderStatusChange,
  onPaymentStatusChange,
  onClearFilters,
}: OrdersToolbarProps) {
  return (
    <div className="pt-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={19}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A99A8D]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search order, customer or phone..."
            className="h-[45px] w-full rounded-xl border border-[#EADFD4] bg-white pl-11 pr-11 text-sm text-[#493D35] outline-none transition placeholder:text-[#B4A69A] focus:border-[#B5697A]"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#A99A8D] transition hover:bg-[#FBECEF] hover:text-[#B5697A]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Order Status */}
        <div className="relative w-full lg:w-[200px] lg:shrink-0">
          <select
            value={orderStatus}
            onChange={(event) =>
              onOrderStatusChange(
                event.target.value as OrderStatus | ""
              )
            }
            className="h-[45px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white px-4 pr-10 text-sm text-[#6F6259] outline-none transition focus:border-[#B5697A]"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <ChevronDown
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#B5A79B]"
          />
        </div>

        {/* Payment Status */}
        <div className="relative w-full lg:w-[200px] lg:shrink-0">
          <select
            value={paymentStatus}
            onChange={(event) =>
              onPaymentStatusChange(
                event.target.value as PaymentStatus | ""
              )
            }
            className="h-[45px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white px-4 pr-10 text-sm text-[#6F6259] outline-none transition focus:border-[#B5697A]"
          >
            <option value="">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <ChevronDown
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#B5A79B]"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-[45px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E8CDD3] bg-[#FFF7F8] px-4 text-sm text-[#B5697A] transition hover:bg-[#FBECEF]"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default OrdersToolbar;