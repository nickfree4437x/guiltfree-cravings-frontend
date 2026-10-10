// src/components/admin/customers/CustomersPageHeader.tsx

function CustomersPageHeader() {
  return (
    <div className="">

      <h1 className="mt-2 text-[18px] md:text-[24px] font-bold tracking-tight text-slate-900">
        Customers
      </h1>

      <p className="mt-0 max-w-xl text-sm leading-relaxed text-slate-500">
        View and manage customers registered
        with your GuiltFree Cravings store.
      </p>
    </div>
  );
}

export default CustomersPageHeader;