import type { Order } from "../../api/orderApi";

interface OrderItemsListProps {
  items: Order["items"];
}

function OrderItemsList({
  items,
}: OrderItemsListProps) {
  return (
    <div className="space-y-3">
      {items.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="
            flex items-center justify-between gap-4
            rounded-xl
            border border-[#EFE3D2]
            bg-white
            px-4 py-3.5
            transition-all duration-200
            hover:border-[#DDB0BB]
          "
        >
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-[#3E3430] sm:text-[13px]">
              {item.productName}
            </p>

            <p className="mt-1.5 text-[10px] text-[#A39890] sm:text-[11px]">
              {item.variantQuantity}
              {item.variantUnit}
              {" • "}
              Qty: {item.quantity}
            </p>
          </div>

          <p className="shrink-0 text-[12px] font-semibold text-[#B5697A] sm:text-[13px]">
            ₹{item.subtotal}
          </p>
        </div>
      ))}

      {items.length > 3 && (
        <p className="px-1 pt-1 text-[10px] font-medium text-[#B5697A] sm:text-[11px]">
          + {items.length - 3} more{" "}
          {items.length - 3 === 1 ? "item" : "items"}
        </p>
      )}
    </div>
  );
}

export default OrderItemsList;