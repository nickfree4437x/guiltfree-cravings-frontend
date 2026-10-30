// src/components/admin/customers/CustomersList.tsx

import type { AdminCustomer } from "./types";

import CustomersEmptyState from "./CustomersEmptyState";
import CustomersTable from "./CustomersTable";

// ─── Types ────────────────────────────────────────────────
interface CustomersListProps {
  customers: AdminCustomer[];
  hasSearch: boolean;
  onClearSearch: () => void;
}

// ─── Component ────────────────────────────────────────────
function CustomersList({
  customers,
  hasSearch,
  onClearSearch,
}: CustomersListProps) {
  // Empty state
  if (customers.length === 0) {
    return <CustomersEmptyState hasSearch={hasSearch} onClearSearch={onClearSearch} />;
  }

  // Main list
  return (
    <section className="overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm">
      <CustomersTable customers={customers} />
    </section>
  );
}

export default CustomersList;