import type { CartItem } from "../../store/cartStore";

interface ReviewOrderItemsProps {
  items: CartItem[];
  totalItems: number;
}

function ReviewOrderItems({
  items,
  totalItems,
}: ReviewOrderItemsProps) {
  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Your Items
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {totalItems}{" "}
          {totalItems === 1
            ? "item"
            : "items"}{" "}
          in your order.
        </p>

      </div>

      {/* =================================================
          ORDER ITEMS
      ================================================= */}

      <div className="mt-7 divide-y divide-[#eadfd3]">

        {items.map((item) => {

          const itemTotal =
            item.variant.price *
            item.quantity;

          const variantLabel =
            `${item.variant.quantity}${item.variant.unit}`;

          return (
            <div
              key={`${item.product.id}-${item.variant.id}`}
              className="flex gap-4 py-5 first:pt-0 last:pb-0"
            >

              {/* ===========================================
                  PRODUCT IMAGE
              =========================================== */}

              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5eadf] sm:h-24 sm:w-24">

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

              </div>

              {/* ===========================================
                  PRODUCT INFORMATION
              =========================================== */}

              <div className="min-w-0 flex-1">

                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {item.product.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-[#f3e4d3] px-2.5 py-1 text-[10px] text-[#8b542f]">
                    {variantLabel}
                  </span>

                  <span className="text-xs capitalize text-slate-400">
                    {item.variant.packaging}
                  </span>

                </div>

                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  ₹{item.variant.price} ×{" "}
                  {item.quantity}
                </p>

              </div>

              {/* ===========================================
                  ITEM TOTAL
              =========================================== */}

              <div className="shrink-0 text-right">

                <p className="text-sm font-bold text-[#8b542f] sm:text-base">
                  ₹{itemTotal}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default ReviewOrderItems;