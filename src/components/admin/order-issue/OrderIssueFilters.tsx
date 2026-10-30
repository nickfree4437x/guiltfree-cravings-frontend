import { Search, ChevronDown, ArrowDownUp, ArrowDown } from "lucide-react";
import { STATUS_OPTIONS } from "./OrderIssueTypes";
import type { OrderIssueStatus } from "./OrderIssueTypes";

interface OrderIssueFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  statusFilter: OrderIssueStatus | "";
  setStatusFilter: (val: OrderIssueStatus | "") => void;
  issueTypeFilter: string;
  setIssueTypeFilter: (val: string) => void;
  issueTypes: string[];
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  setPage: (val: number) => void;
}

export function OrderIssueFilters({
  searchInput, setSearchInput, statusFilter, setStatusFilter,
  issueTypeFilter, setIssueTypeFilter, issueTypes,
  sortOrder, setSortOrder, setPage,
}: OrderIssueFiltersProps) {
  return (
    <div className="border-b border-gray-100">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        
        {/* Search Input (Full width on mobile & desktop) */}
        <div className="relative w-full min-w-0 lg:flex-1">
          <Search
            size={19}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search order, customer or issue..."
            className="h-[42px] w-full rounded-xl border border-[#EADFD4] bg-white pl-11 pr-4 text-[11px] md:text-[12px] text-slate-500 outline-none transition placeholder:text-slate-500 focus:border-[#B5697A]"
          />
        </div>

        {/* Mobile ke liye 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-row lg:items-center lg:gap-3">
          
          {/* Status Filter */}
          <div className="relative w-full lg:w-[180px] lg:shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as OrderIssueStatus | ""); setPage(1); }}
              className="h-[42px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white px-3 pr-8 text-[11px] md:text-[12px] text-slate-500 outline-none transition focus:border-[#B5697A] lg:px-4 lg:pr-10"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 lg:right-4 lg:size-[17px]"
            />
          </div>

          {/* Issue Type Filter */}
          <div className="relative w-full lg:w-[190px] lg:shrink-0">
            <select
              value={issueTypeFilter}
              onChange={(e) => { setIssueTypeFilter(e.target.value); setPage(1); }}
              className="h-[42px] w-full appearance-none rounded-xl border border-[#EADFD4] bg-white px-3 pr-8 text-[11px] md:text-[12px] text-slate-500 outline-none transition focus:border-[#B5697A] lg:px-4 lg:pr-10"
            >
              <option value="">All Issue Types</option>
              {issueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 lg:right-4 lg:size-[17px]"
            />
          </div>

          {/* Sort Button (Ab grid mein full width lega mobile pe) */}
          <button
            type="button"
            onClick={() => { setSortOrder(sortOrder === "desc" ? "asc" : "desc"); setPage(1); }}
            className="col-span-2 inline-flex h-[42px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#EADFD4] bg-white px-3 text-[11px] md:text-[12px] text-slate-500 transition hover:border-[#B5697A]/50 hover:text-[#B5697A] lg:col-span-1 lg:w-auto lg:px-4"
          >
            <ArrowDownUp size={15} strokeWidth={1.8} />
            <span className="whitespace-nowrap">
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
            {sortOrder === "desc" ? <ArrowDown size={14} /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}