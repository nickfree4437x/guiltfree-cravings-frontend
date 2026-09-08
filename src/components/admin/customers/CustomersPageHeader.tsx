// src/components/admin/customers/CustomersPageHeader.tsx

function CustomersPageHeader() {
  return (
    <div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Customers
      </h1>

      <p className="mt-0 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        View and manage customers registered
        with your GuiltFree Cravings store.
      </p>
    </div>
  );
}

export default CustomersPageHeader;