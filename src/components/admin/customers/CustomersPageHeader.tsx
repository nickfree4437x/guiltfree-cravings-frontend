// src/components/admin/customers/CustomersPageHeader.tsx

function CustomersPageHeader() {
  return (
    <div className="">

      <h1 className="mt-2 text-[18px] font-bold tracking-tight text-slate-700 md:text-[22px]">
        Customers
      </h1>

      <p className="mt-0 max-w-xl text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">
        View and manage your registered customers.
      </p>
    </div>
  );
}

export default CustomersPageHeader;