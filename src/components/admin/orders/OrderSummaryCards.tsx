// src/components/admin/orders/OrderSummaryCards.tsx

interface OrderSummaryCardsProps {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  completedOrders: number;
}

function OrderSummaryCards({
  totalOrders,
  pendingOrders,
  paidOrders,
  completedOrders,
}: OrderSummaryCardsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* TOTAL */}

      <div className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Total Orders
        </p>

        <p className="mt-3 text-2xl font-bold text-slate-900">
          {totalOrders}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          All customer orders
        </p>
      </div>

      {/* PENDING */}

      <div className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Pending
        </p>

        <p className="mt-3 text-2xl font-bold text-amber-600">
          {pendingOrders}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Awaiting confirmation
        </p>
      </div>

      {/* PAID */}

      <div className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Paid Orders
        </p>

        <p className="mt-3 text-2xl font-bold text-green-600">
          {paidOrders}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Successfully paid
        </p>
      </div>

      {/* COMPLETED */}

      <div className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Completed
        </p>

        <p className="mt-3 text-2xl font-bold text-[#8b542f]">
          {completedOrders}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Completed orders
        </p>
      </div>

    </div>
  );
}

export default OrderSummaryCards;