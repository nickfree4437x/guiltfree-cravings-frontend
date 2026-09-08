// src/components/admin/customers/CustomersList.tsx

import type {
  AdminCustomer,
} from "./types";

import CustomersEmptyState from "./CustomersEmptyState";
import CustomersMobileList from "./CustomersMobileList";
import CustomersTable from "./CustomersTable";

interface CustomersListProps {
  customers: AdminCustomer[];
  hasSearch: boolean;
  onClearSearch: () => void;
}

function CustomersList({
  customers,
  hasSearch,
  onClearSearch,
}: CustomersListProps) {
  if (customers.length === 0) {
    return (
      <CustomersEmptyState
        hasSearch={hasSearch}
        onClearSearch={
          onClearSearch
        }
      />
    );
  }

  return (
    <>
      <CustomersTable
        customers={customers}
      />

      <CustomersMobileList
        customers={customers}
      />
    </>
  );
}

export default CustomersList;