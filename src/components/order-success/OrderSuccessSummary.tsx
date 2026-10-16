import type { Order } from "../../api/orderApi";

interface OrderSuccessSummaryProps {
  order: Order;
}

function OrderSuccessSummary({ order }: OrderSuccessSummaryProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#eadfd3] bg-white px-6 py-4 sm:px-8">
        <h2 className="text-[14px] font-semibold tracking-tight text-slate-700 sm:text-[16px]">
          Order Summary
        </h2>

        <p className="text-[12px] font-light sm:text-[13px] md:text-[13.5px] leading-relaxed tracking-wide mx-auto text-gray-600">
          A quick overview of the items in your order.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Order Items */}
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4"
            >
              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <p className="break-words text-[12px] font-semibold leading-relaxed text-slate-700 sm:text-[14px]">
                  {item.productName}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="text-[#8b542f]">
                    {item.variantQuantity}
                    {item.variantUnit}
                  </span>

                  <span className="text-[#d8c8bb]">•</span>

                  <span className="capitalize text-slate-500">
                    {item.packaging}
                  </span>

                  <span className="text-[#d8c8bb]">•</span>

                  <span className="text-slate-500">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>

              {/* Item Subtotal */}
              <p className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-slate-900 sm:text-base">
                ₹{item.subtotal}
              </p>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="my-6 border-t border-dashed border-[#eadfd3]" />

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">Subtotal</span>

          <span className="font-semibold tabular-nums text-slate-700">
            ₹{order.subtotal}
          </span>
        </div>

        {/* Total */}
        <div className="mt-4 rounded-xl border border-[#eadfd3] bg-[#fff8f7] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-slate-700 sm:text-[16px]">
                Total Amount
              </p>
            </div>

            <p className="shrink-0 text-[16px] font-semibold tracking-tight tabular-nums text-[#B5697A] sm:text-[18px]">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessSummary;