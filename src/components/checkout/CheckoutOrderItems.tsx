import type { CartItem } from "../../store/cartStore";

interface CheckoutOrderItemsProps {
  items?: CartItem[];
}

const INITIAL_VISIBLE_ITEMS = 2;

function CheckoutOrderItems({
  items = [],
}: CheckoutOrderItemsProps) {
  /*
   * =========================================================
   * SAFE ITEMS
   * =========================================================
   */

  const safeItems = Array.isArray(items)
    ? items
    : [];

  /*
   * =========================================================
   * VISIBLE ITEMS
   * =========================================================
   */

  const visibleItems = safeItems.slice(
    0,
    INITIAL_VISIBLE_ITEMS
  );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="mt-6">

      {/* =====================================================
          ORDER ITEMS
      ===================================================== */}

      <div className="space-y-4">

        {visibleItems.map((item) => {
          const itemSubtotal =
            item.variant.price *
            item.quantity;

          const variantLabel =
            `${item.variant.quantity}${item.variant.unit}`;

          return (
            <div
              key={`${item.product.id}-${item.variant.id}`}
              className="flex gap-3"
            >

              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eadf]">

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

              </div>

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="min-w-0 flex-1">

                <p className="line-clamp-2 text-[12] md:text-[14] font-semibold text-slate-800">
                  {item.product.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">

                  <span className="text-xs text-[#8b542f]">
                    {variantLabel}
                  </span>

                  <span
                    className="text-xs text-slate-300"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <span className="text-xs font-[350] capitalize text-slate-400">
                    {item.variant.packaging}
                  </span>

                  <span
                    className="text-xs text-slate-300"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <span className="text-xs font-[350] text-slate-500">
                    Qty: {item.quantity}
                  </span>

                </div>

              </div>

              {/* =================================================
                  ITEM SUBTOTAL
              ================================================= */}

              <p className="shrink-0 text-sm font-semibold text-slate-900">
                ₹{itemSubtotal}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default CheckoutOrderItems;