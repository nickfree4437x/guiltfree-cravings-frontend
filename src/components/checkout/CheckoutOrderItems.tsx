
import type { CartItem } from "../../store/cartStore";

// ─── Types ────────────────────────────────────────────────
interface CheckoutOrderItemsProps {
  items?: CartItem[];
  itemDiscounts?: Record<string, number>;
}

// ─── Config ───────────────────────────────────────────────
const INITIAL_VISIBLE_ITEMS = 2;

// ─── Helpers ──────────────────────────────────────────────
function getPackagingImage(item: CartItem): string {
  const { packaging } = item.variant;
  const p = item.product;

  if (packaging === "Glass Jar") {
    return p.glassJarImages?.[0] || p.glassJarImage || p.image;
  }

  if (packaging === "Cardboard Box") {
    return p.cardboardBoxImages?.[0] || p.cardboardBoxImage || p.image;
  }

  return p.regularImages?.[0] || p.image;
}

// ─── Component ────────────────────────────────────────────
function CheckoutOrderItems({
  items = [],
  itemDiscounts = {},
}: CheckoutOrderItemsProps) {
  const safeItems = Array.isArray(items) ? items : [];

  const visibleItems = safeItems.slice(0, INITIAL_VISIBLE_ITEMS);
  const hiddenCount = Math.max(
    0,
    safeItems.length - INITIAL_VISIBLE_ITEMS
  );

  return (
    <div className="w-full">
      <div className="space-y-4">
        {visibleItems.map((item) => {
          const itemSubtotal = item.variant.price * item.quantity;

          const itemKey = `${item.product.id}-${item.variant.id}`;

          const itemDiscount = Math.min(
            itemSubtotal,
            Math.max(0, Number(itemDiscounts[itemKey]) || 0)
          );

          const discountedSubtotal = Math.max(
            0,
            itemSubtotal - itemDiscount
          );

          const variantLabel = `${item.variant.quantity}${item.variant.unit}`;
          const packagingImage = getPackagingImage(item);

          return (
            <div
              key={itemKey}
              className="flex min-w-0 gap-3 rounded-xl border border-[#F3E7E9] bg-white p-3"
            >
              {/* Image */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                <img
                  src={packagingImage}
                  alt={`${item.product.name} - ${item.variant.packaging}`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Product Information */}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[12px] font-semibold leading-5 text-[#2C2C2C] md:text-[13px]">
                  {item.product.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span className="text-[10px] text-[#B5697A] sm:text-[11px]">
                    {variantLabel}
                  </span>

                  <span className="text-[10px] text-[#E6D5D9]">
                    •
                  </span>

                  <span className="text-[10px] text-slate-400 sm:text-[11px]">
                    {item.variant.packaging}
                  </span>

                  <span className="text-[10px] text-[#E6D5D9]">
                    •
                  </span>

                  <span className="text-[10px] text-slate-500 sm:text-[11px]">
                    Qty: {item.quantity}
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  ₹{item.variant.price.toFixed(2)} per item
                </p>

                {itemDiscount > 0 && (
                  <p className="mt-1 text-[10px] font-medium text-green-700">
                    You save ₹{itemDiscount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="shrink-0 self-start pt-0.5 text-right">
                {itemDiscount > 0 ? (
                  <>
                    <p className="text-[12px] font-semibold text-green-700 sm:text-[13px]">
                      ₹{discountedSubtotal.toFixed(2)}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400 line-through">
                      ₹{itemSubtotal.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-[12px] font-semibold text-[#2C2C2C] sm:text-[13px]">
                    ₹{itemSubtotal.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden Items Indicator */}
      {hiddenCount > 0 && (
        <p className="mt-3 text-center text-[10px] text-[#B5697A]">
          + {hiddenCount} more{" "}
          {hiddenCount === 1 ? "item" : "items"} in your cart
        </p>
      )}
    </div>
  );
}

export default CheckoutOrderItems;
