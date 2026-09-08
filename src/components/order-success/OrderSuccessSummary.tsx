import type { Order } from "../../api/orderApi";

interface OrderSuccessSummaryProps {
  order: Order;
}

function OrderSuccessSummary({
  order,
}: OrderSuccessSummaryProps) {
  return (
    <section className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      <h2 className="text-xl font-bold text-slate-900">
        Order Summary
      </h2>

      {/* Order Items */}

      <div className="mt-6 space-y-5">

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4"
          >

            {/* Product */}

            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-slate-800 sm:text-base">
                {item.productName}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">

                <span className="text-xs font-medium text-[#8b542f]">
                  {item.variantQuantity}
                  {item.variantUnit}
                </span>

                <span className="text-xs text-slate-300">
                  •
                </span>

                <span className="text-xs capitalize text-slate-400">
                  {item.packaging}
                </span>

                <span className="text-xs text-slate-300">
                  •
                </span>

                <span className="text-xs text-slate-500">
                  Qty: {item.quantity}
                </span>

              </div>

            </div>

            {/* Item Total */}

            <p className="shrink-0 text-sm font-semibold text-slate-900">
              ₹{item.subtotal}
            </p>

          </div>
        ))}

      </div>

      <div className="my-6 h-px bg-[#eadfd3]" />

      {/* Subtotal */}

      <div className="flex items-center justify-between text-sm">

        <span className="text-slate-500">
          Subtotal
        </span>

        <span className="font-semibold text-slate-900">
          ₹{order.subtotal}
        </span>

      </div>

      <div className="my-5 h-px bg-[#eadfd3]" />

      {/* Total */}

      <div className="flex items-center justify-between">

        <span className="text-base font-bold text-slate-900 sm:text-lg">
          Total
        </span>

        <span className="text-2xl font-bold text-[#8b542f] sm:text-3xl">
          ₹{order.totalAmount}
        </span>

      </div>

    </section>
  );
}

export default OrderSuccessSummary;