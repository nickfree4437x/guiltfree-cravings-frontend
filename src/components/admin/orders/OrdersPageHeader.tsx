// src/components/admin/orders/OrdersPageHeader.tsx

function OrdersPageHeader() {
  return (
    <div>

      <h1 className="mt-2 text-[18px] font-bold tracking-tight text-slate-700 md:text-[22px]">
        Orders
      </h1>

      <p className="mt-0 max-w-xl text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">
        Manage customer orders from your store.
      </p>
    </div>
  );
}

export default OrdersPageHeader;