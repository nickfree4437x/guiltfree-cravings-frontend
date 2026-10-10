import {
  ChevronDown,
  Search,
} from "lucide-react";

type VerificationFilter =
  | "all"
  | "verified"
  | "unverified";

type OrdersFilter =
  | "all"
  | "with-orders"
  | "no-orders";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  verificationFilter: VerificationFilter;
  onVerificationFilterChange: (
    value: VerificationFilter
  ) => void;

  ordersFilter: OrdersFilter;
  onOrdersFilterChange: (
    value: OrdersFilter
  ) => void;

  hasActiveFilters: boolean;
  onClear: () => void;
}

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

      {/* Controls */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px_210px]">
        {/* Search */}
        <div>
          <div className="relative">
            <Search
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                h-[18px]
                w-[18px]
                -translate-y-1/2
                text-[#A9998C]
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search by name, email or phone..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-[#E8DED3]
                bg-white
                pl-10
                pr-4
                text-[13px]
                text-[#3D3834]
                outline-none
                placeholder:text-[#B0A39A]
                hover:border-[#DCCDC0]
                focus:border-[#B5697A]
              "
            />
          </div>
        </div>

        {/* Verification */}
        <div>

          <div className="relative">
            <select
              id="verification-filter"
              value={verificationFilter}
              onChange={(event) =>
                onVerificationFilterChange(
                  event.target.value as VerificationFilter
                )
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-xl
                border
                border-[#E8DED3]
                bg-white
                px-3.5
                pr-10
                text-[13px]
                text-[#514840]
                outline-none
                hover:border-[#DCCDC0]
                focus:border-[#B5697A]
              "
            >
              <option value="all">
                All Customers
              </option>
              <option value="verified">
                Verified
              </option>
              <option value="unverified">
                Unverified
              </option>
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
                text-[#9A8D82]
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Orders */}
        <div>

          <div className="relative">
            <select
              id="orders-filter"
              value={ordersFilter}
              onChange={(event) =>
                onOrdersFilterChange(
                  event.target.value as OrdersFilter
                )
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-xl
                border
                border-[#E8DED3]
                bg-white
                px-3.5
                pr-10
                text-[13px]
                text-[#514840]
                outline-none
                hover:border-[#DCCDC0]
                focus:border-[#B5697A]
              "
            >
              <option value="all">
                All Customers
              </option>
              <option value="with-orders">
                With Orders
              </option>
              <option value="no-orders">
                No Orders
              </option>
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
                text-[#9A8D82]
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerFilters;