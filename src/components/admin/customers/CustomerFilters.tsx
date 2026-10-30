import { ChevronDown, Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
type VerificationFilter = "all" | "verified" | "unverified";
type OrdersFilter = "all" | "with-orders" | "no-orders";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  verificationFilter: VerificationFilter;
  onVerificationFilterChange: (value: VerificationFilter) => void;
  ordersFilter: OrdersFilter;
  onOrdersFilterChange: (value: OrdersFilter) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// ─── Shared Classes ───────────────────────────────────────
const INPUT_BASE =
  "h-11 w-full rounded-xl border border-[#E8DED3] bg-white text-[11px] md:text-[12px] text-slate-500 outline-none hover:border-[#DCCDC0] focus:border-[#B5697A]";

// ─── Sub-component: Filter Select ─────────────────────────
function FilterSelect({ id, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_BASE} appearance-none px-3.5 pr-10`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
function CustomerFilters({
  search,
  onSearchChange,
  verificationFilter,
  onVerificationFilterChange,
  ordersFilter,
  onOrdersFilterChange,
}: CustomerFiltersProps) {
  return (
    <section className="mt-4 rounded-xl">
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px_210px]">
        {/* Search */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            id="customer-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email or phone..."
            className={`${INPUT_BASE} pl-10 pr-4 placeholder:text-slate-500`}
          />
        </div>

        {/* Verification Filter */}
        <FilterSelect
          id="verification-filter"
          value={verificationFilter}
          onChange={(v) => onVerificationFilterChange(v as VerificationFilter)}
          options={[
            { value: "all", label: "All Customers" },
            { value: "verified", label: "Verified" },
            { value: "unverified", label: "Unverified" },
          ]}
        />

        {/* Orders Filter */}
        <FilterSelect
          id="orders-filter"
          value={ordersFilter}
          onChange={(v) => onOrdersFilterChange(v as OrdersFilter)}
          options={[
            { value: "all", label: "All Customers" },
            { value: "with-orders", label: "With Orders" },
            { value: "no-orders", label: "No Orders" },
          ]}
        />
      </div>
    </section>
  );
}

export default CustomerFilters;