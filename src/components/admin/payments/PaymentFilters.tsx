import { Search, X, ChevronDown, CalendarDays } from "lucide-react";
import type { StatusFilter } from "./types";

interface PaymentFiltersProps {
  searchInput: string;
  status: StatusFilter;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onDateChange: (value: string) => void;
}

export function PaymentFilters({
  searchInput,
  status,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
}: PaymentFiltersProps) {
  return (
    <div className="pt-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={19}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search payment, order, customer or phone..."
            className="h-[42px] w-full rounded-xl border border-[#EADFD4] bg-white pl-11 pr-11 text-[11px] md:text-[12px] text-slate-500 outline-none transition placeholder:text-slate-500 focus:border-[#B5697A]"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#FBECEF] hover:text-[#B5697A]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          
          {/* Status Filter */}
          <div className="relative w-full lg:w-[200px] lg:shrink-0">
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
              className="h-[42px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white px-4 pr-10 text-[11px] md:text-[12px] text-slate-500 outline-none transition focus:border-[#B5697A]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative w-full lg:w-[200px] lg:shrink-0">
            <CalendarDays
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={dateFilter}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-[42px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white pl-10 pr-10 text-[11px] md:text-[12px] text-slate-500 outline-none transition focus:border-[#B5697A]"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="THIS_MONTH">This Month</option>
            </select>

            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>

        </div>
      </div>
    </div>
  );
}