interface CustomerSummaryCardsProps {
  totalCustomers: number;
  verifiedCustomers: number;
  customersWithOrders: number;
}

function CustomerSummaryCards({
  totalCustomers,
  verifiedCustomers,
  customersWithOrders,
}: CustomerSummaryCardsProps) {
  const unverifiedCustomers = Math.max(
    totalCustomers - verifiedCustomers,
    0
  );

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL CUSTOMERS */}

      <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-600">
          Total Customers
        </p>

        <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#B5697A]">
          {totalCustomers.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-[12px] text-[#8B7A6C]">
          Registered customers
        </p>
      </div>

      {/* VERIFIED */}

      <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-600">
          Verified
        </p>

        <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#3F8A58]">
          {verifiedCustomers.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-[12px] text-[#8B7A6C]">
          OTP verified accounts
        </p>
      </div>

      {/* UNVERIFIED */}

      <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-600">
          Unverified
        </p>

        <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#C4773B]">
          {unverifiedCustomers.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-[12px] text-[#8B7A6C]">
          Pending OTP verification
        </p>
      </div>

      {/* WITH ORDERS */}

      <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-600">
          With Orders
        </p>

        <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#4D7FEA]">
          {customersWithOrders.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-[12px] text-[#8B7A6C]">
          Customers who placed orders
        </p>
      </div>
    </div>
  );
}

export default CustomerSummaryCards;