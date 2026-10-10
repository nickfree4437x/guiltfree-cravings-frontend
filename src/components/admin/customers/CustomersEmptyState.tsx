// src/components/admin/customers/CustomersEmptyState.tsx

interface CustomersEmptyStateProps {
  hasSearch: boolean;
  onClearSearch: () => void;
}

function CustomersEmptyState({
  hasSearch,
}: CustomersEmptyStateProps) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {hasSearch
          ? "No customers found"
          : "No customers yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSearch
          ? "No customers match your search. Try a different name, email, or phone number."
          : "Customers registered through your store will appear here."}
      </p>

    </div>
  );
}

export default CustomersEmptyState;