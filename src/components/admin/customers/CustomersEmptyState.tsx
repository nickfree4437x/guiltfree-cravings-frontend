// src/components/admin/customers/CustomersEmptyState.tsx

interface CustomersEmptyStateProps {
  hasSearch: boolean;
  onClearSearch: () => void;
}

function CustomersEmptyState({
  hasSearch,
  onClearSearch,
}: CustomersEmptyStateProps) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {hasSearch
          ? "No customers found"
          : "No customers yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSearch
          ? "No customers match your search. Try a different name, email, or phone number."
          : "Customers registered through your store will appear here."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Clear Search
        </button>
      )}

    </div>
  );
}

export default CustomersEmptyState;