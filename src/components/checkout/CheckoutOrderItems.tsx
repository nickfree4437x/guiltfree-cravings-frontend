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
    <div className="w-full">
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
              className="
                flex
                min-w-0
                gap-3
                rounded-xl
                border
                border-[#F3E7E9]
                bg-[#FFFDFD]
                p-3
              "
            >
              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div
                className="
                  h-16
                  w-16
                  shrink-0
                  overflow-hidden
                "
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="min-w-0 flex-1">
                <p
                  className="
                    line-clamp-2
                    text-[12px]
                    font-semibold
                    leading-5
                    text-[#2C2C2C]
                    md:text-[13px]
                  "
                >
                  {item.product.name}
                </p>

                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-x-1.5
                    gap-y-0.5
                  "
                >
                  {/* Variant */}

                  <span
                    className="
                      text-[10px]
                      text-[#B5697A]
                      sm:text-[11px]
                    "
                  >
                    {variantLabel}
                  </span>

                  <span
                    className="
                      text-[10px]
                      text-[#E6D5D9]
                      sm:text-[11px]
                    "
                    aria-hidden="true"
                  >
                    •
                  </span>

                  {/* Packaging */}

                  <span
                    className="
                      text-[10px]
                      font-normal
                      capitalize
                      text-slate-400
                      sm:text-[11px]
                    "
                  >
                    {item.variant.packaging}
                  </span>

                  <span
                    className="
                      text-[10px]
                      text-[#E6D5D9]
                      sm:text-[11px]
                    "
                    aria-hidden="true"
                  >
                    •
                  </span>

                  {/* Quantity */}

                  <span
                    className="
                      text-[10px]
                      text-slate-500
                      sm:text-[11px]
                    "
                  >
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>

              {/* =================================================
                  ITEM SUBTOTAL
              ================================================= */}

              <p
                className="
                  shrink-0
                  self-start
                  pt-0.5
                  text-[12px]
                  text-[#2C2C2C]
                  sm:text-[13px]
                "
              >
                ₹{itemSubtotal}
              </p>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          HIDDEN ITEMS INDICATOR
      ===================================================== */}

      {safeItems.length > INITIAL_VISIBLE_ITEMS && (
        <p
          className="
            mt-3
            text-center
            text-[10px]
            text-[#B5697A]
          "
        >
          + {safeItems.length - INITIAL_VISIBLE_ITEMS} more{" "}
          {safeItems.length - INITIAL_VISIBLE_ITEMS === 1
            ? "item"
            : "items"}{" "}
          in your cart
        </p>
      )}
    </div>
  );
}

export default CheckoutOrderItems;