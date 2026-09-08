// src/components/admin/orders/OrdersPageHeader.tsx

function OrdersPageHeader() {
  return (
    <div>

      <h1 className="mt-2 text-[18px] md:text-[26px] font-bold tracking-tight text-slate-900">
        Orders
      </h1>

      <p className="mt-0 max-w-2xl text-[12px] md:text-[14.5px] leading-6 text-slate-500">
        View and manage customer orders from your
        GuiltFree Cravings store.
      </p>
    </div>
  );
}

export default OrdersPageHeader;