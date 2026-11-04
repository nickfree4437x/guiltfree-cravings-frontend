
import type { Order } from "../../api/orderApi";

interface OrderItemsListProps {
  items: Order["items"];
}

function formatCurrency(value: number | string) {
  const amount = Number(value);

  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function OrderItemsList({ items }: OrderItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-[#EFE3D2] bg-[#FFFBFC] px-4 py-6 text-center">
        <p className="text-[12px] text-[#8B7A6C]">
          No product details available for this order.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Ordered products" className="space-y-3">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#3E3430] sm:text-[14px]">
          Ordered Products
        </h3>

        <span className="text-[10px] font-medium text-[#A39890] sm:text-[11px]">
          {items.length} {items.length === 1 ? "Product" : "Products"}
        </span>
      </div>

      {items.slice(0, 3).map((item) => {
        const subtotal = Number(item.subtotal) || 0;
        const discount = Math.min(
          subtotal,
          Math.max(0, Number(item.discountAmount) || 0)
        );

        const finalPrice = subtotal - discount;
        const hasDiscount = discount > 0;

        const discountedUnitPrice =
          item.quantity > 0 ? finalPrice / item.quantity : 0;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-[#EFE3D2] bg-white px-4 py-3.5 transition-all duration-200 hover:border-[#DDB0BB]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#3E3430] sm:text-[13px]">
                {item.productName}
              </p>

              <p className="mt-1.5 text-[10px] text-[#A39890] sm:text-[11px]">
                {item.variantQuantity}
                {item.variantUnit}
                {" • "}
                {item.packaging}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                {hasDiscount ? (
                  <>
                    <span className="text-[10px] text-[#A39890] line-through">
                      {formatCurrency(item.unitPrice)}
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-700">
                      {formatCurrency(discountedUnitPrice)} per item
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-[#8B7A6C] sm:text-[11px]">
                    {formatCurrency(item.unitPrice)} per item
                  </span>
                )}

                <span className="text-[10px] text-[#A39890]">
                  •
                </span>

                <span className="text-[10px] text-[#8B7A6C] sm:text-[11px]">
                  Qty: {item.quantity}
                </span>
              </div>

              {hasDiscount && (
                <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700 sm:text-[10px]">
                  <span className="mr-1">✓</span>
                  OFFER APPLIED · Saved {formatCurrency(discount)}
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              {hasDiscount && (
                <p className="text-[10px] text-[#A39890] line-through">
                  {formatCurrency(subtotal)}
                </p>
              )}

              <p className="text-[13px] font-bold text-[#B5697A] sm:text-[14px]">
                {formatCurrency(finalPrice)}
              </p>

              <p className="mt-1 text-[9px] text-[#A39890] sm:text-[10px]">
                {hasDiscount ? "Discounted total" : "Item total"}
              </p>
            </div>
          </div>
        );
      })}

      {items.length > 3 && (
        <div className="rounded-lg bg-[#FFFBFC] px-3 py-2">
          <p className="text-[10px] font-medium text-[#B5697A] sm:text-[11px]">
            + {items.length - 3} more{" "}
            {items.length - 3 === 1 ? "item" : "items"} in your order
          </p>
        </div>
      )}
    </section>
  );
}

export default OrderItemsList;
