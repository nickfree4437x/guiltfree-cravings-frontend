import {
  ChevronDown,
  Search,
} from "lucide-react";

import type {
  RatingFilter,
  StatusFilter,
} from "./types";

interface ReviewFiltersProps {
  search: string;
  statusFilter: StatusFilter;
  ratingFilter: RatingFilter;
  onSearchChange: (
    value: string
  ) => void;
  onStatusChange: (
    value: StatusFilter
  ) => void;
  onRatingChange: (
    value: RatingFilter
  ) => void;
}

interface FilterSelectProps {
  value: string;
  onChange: (
    value: string
  ) => void;
  options: [string, string][];
}

function ReviewFilters({
  search,
  statusFilter,
  ratingFilter,
  onSearchChange,
  onStatusChange,
  onRatingChange,
}: ReviewFiltersProps) {
  return (
    <section
      className="
        mt-5
      "
    >

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-[#A99B90]
            "
            strokeWidth={1.8}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search reviews, customer or product..."
            className="
              h-10
              w-full
              rounded-xl
              border
              border-[#E8DED3]
              bg-white
              pl-10
              pr-4
              text-[12px]
              text-[#3D3834]
              outline-none
              transition-all
              duration-200
              placeholder:text-[#A99B90]
              hover:border-[#D9C8BA]
              focus:border-[#B5697A]
              focus:ring-[#B5697A]/10
            "
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(value) =>
            onStatusChange(
              value as StatusFilter
            )
          }
          options={[
            ["ALL", "All Status"],
            ["PENDING", "Pending"],
            ["VERIFIED", "Verified"],
            ["REJECTED", "Rejected"],
          ]}
        />

        <FilterSelect
          value={ratingFilter}
          onChange={(value) =>
            onRatingChange(
              value as RatingFilter
            )
          }
          options={[
            ["ALL", "All Ratings"],
            ["5", "5 Stars"],
            ["4", "4 Stars"],
            ["3", "3 Stars"],
            ["2", "2 Stars"],
            ["1", "1 Star"],
          ]}
        />
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-10
          w-full
          appearance-none
          rounded-xl
          border
          border-[#E8DED3]
          bg-white
          px-4
          pr-10
          text-[12px]
          text-[#6F6259]
          outline-none
          transition-all
          duration-200
          hover:border-[#D9C8BA]
          focus:border-[#B5697A]
          focus:ring-[#B5697A]/10
        "
      >
        {options.map(
          ([optionValue, label]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-[#A99B90]
        "
        strokeWidth={1.8}
      />
    </div>
  );
}

export default ReviewFilters;