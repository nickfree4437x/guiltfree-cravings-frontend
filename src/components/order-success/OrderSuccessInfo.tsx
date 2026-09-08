import type { Order } from "../../api/orderApi";

interface OrderSuccessInfoProps {
  order: Order;
}

function OrderSuccessInfo({
  order,
}: OrderSuccessInfoProps) {
  return (
    <section className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Order Number
          </p>

          <h2 className="mt-2 break-all text-xl font-bold text-slate-900 sm:text-2xl">
            {order.orderNumber}
          </h2>

        </div>

        {/* Payment Status */}

        <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          {order.paymentStatus}
        </span>

      </div>

      <div className="my-7 h-px bg-[#eadfd3]" />

      {/* Order Details */}

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Customer */}

        <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Customer
          </p>

          <p className="mt-2 break-words text-sm font-semibold text-slate-800">
            {order.customerName}
          </p>

        </div>

        {/* Phone */}

        <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Mobile Number
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            +91 {order.customerPhone}
          </p>

        </div>

        {/* Email */}

        <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4 sm:col-span-2">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
          </p>

          <p className="mt-2 break-all text-sm font-semibold text-slate-800">
            {order.customerEmail || "Not provided"}
          </p>

        </div>

        {/* Order Status */}

        <div className="rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4 sm:col-span-2">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Order Status
          </p>

          <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
            {order.orderStatus
              .toLowerCase()
              .replace(/_/g, " ")}
          </p>

        </div>

      </div>

    </section>
  );
}

export default OrderSuccessInfo;