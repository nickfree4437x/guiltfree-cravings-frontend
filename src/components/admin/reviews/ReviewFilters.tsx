import { ChevronDown, Search } from "lucide-react";

import type { RatingFilter, StatusFilter } from "./types";

// ─── Types ────────────────────────────────────────────────
interface ReviewFiltersProps {
  search: string;
  statusFilter: StatusFilter;
  ratingFilter: RatingFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onRatingChange: (value: RatingFilter) => void;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}

// ─── Config ───────────────────────────────────────────────
const STATUS_OPTIONS: [string, string][] = [
  ["ALL", "All Status"],
  ["PENDING", "Pending"],
  ["VERIFIED", "Verified"],
  ["REJECTED", "Rejected"],
];

const RATING_OPTIONS: [string, string][] = [
  ["ALL", "All Ratings"],
  ["5", "5 Stars"],
  ["4", "4 Stars"],
  ["3", "3 Stars"],
  ["2", "2 Stars"],
  ["1", "1 Star"],
];

// ─── Shared Classes ───────────────────────────────────────
const INPUT_BASE =
  "h-10 w-full rounded-xl border border-[#E8DED3] bg-white text-[12px] outline-none transition-all duration-200 hover:border-[#D9C8BA] focus:border-[#B5697A] focus:ring-[#B5697A]/10";

// ─── Filter Select ────────────────────────────────────────
function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_BASE} appearance-none px-4 pr-10 text-[#6F6259]`}
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        strokeWidth={1.8}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────
function ReviewFilters({
  search,
  statusFilter,
  ratingFilter,
  onSearchChange,
  onStatusChange,
  onRatingChange,
}: ReviewFiltersProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          strokeWidth={1.8}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reviews, customer or product"
          className={`${INPUT_BASE} pl-10 pr-4 text-[#3D3834] placeholder:text-slate-500`}
        />
      </div>

      {/* Status Filter */}
      <FilterSelect
        value={statusFilter}
        onChange={(v) => onStatusChange(v as StatusFilter)}
        options={STATUS_OPTIONS}
      />

      {/* Rating Filter */}
      <FilterSelect
        value={ratingFilter}
        onChange={(v) => onRatingChange(v as RatingFilter)}
        options={RATING_OPTIONS}
      />
    </div>
  );
}

export default ReviewFilters;