// src/components/admin/customers/CustomerSummaryCards.tsx

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
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

      {/* TOTAL CUSTOMERS */}

      <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Total Customers
        </p>

        <p className="mt-3 text-2xl font-bold text-slate-900">
          {totalCustomers.toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Registered customers
        </p>
      </div>

      {/* VERIFIED */}

      <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Verified
        </p>

        <p className="mt-3 text-2xl font-bold text-green-600">
          {verifiedCustomers.toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          OTP verified accounts
        </p>
      </div>

      {/* WITH ORDERS */}

      <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          With Orders
        </p>

        <p className="mt-3 text-2xl font-bold text-[#8b542f]">
          {customersWithOrders.toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Customers who placed orders
        </p>
      </div>

    </div>
  );
}

export default CustomerSummaryCards;