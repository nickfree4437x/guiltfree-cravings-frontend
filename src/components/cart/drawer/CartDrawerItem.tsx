import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "../../../store/cartStore";
import ProductCardImage from "../../product/card/ProductCardImage";

// ─── Types ────────────────────────────────────────────────
interface CartDrawerItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, variantId: number, quantity: number) => void;
  onRemove: (productId: number, variantId: number) => void;
  onProductClick: (productId: number) => void;
}

// ─── Component ────────────────────────────────────────────
function CartDrawerItem({
  item,
  onUpdateQuantity,
  onRemove,
  onProductClick,
}: CartDrawerItemProps) {
  const { product, variant, quantity } = item;

  const itemTotal = Number(variant.price) * quantity;
  const variantLabel = `${variant.quantity}${variant.unit}`;

  const decrease = () => {
    if (quantity > 1) onUpdateQuantity(product.id, variant.id, quantity - 1);
  };
  const increase = () => onUpdateQuantity(product.id, variant.id, quantity + 1);
  const remove = () => onRemove(product.id, variant.id);
  const openProduct = () => onProductClick(product.id);

  // ─── Render ─────────────────────────────────────────────
  return (
    <article className="rounded-lg border border-[#F0E1E5] bg-[#FFFCFC] p-3">
      <div className="flex gap-3">
        {/* Clickable product image */}
        <button
          type="button"
          onClick={openProduct}
          aria-label={`View ${product.name} details`}
          className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
        >
          <ProductCardImage
            product={product}
            packaging={variant.packaging as "Plastic Box" | "Glass Jar" | "Cardboard Box"}
            variant={variant}
            compact
          />
        </button>

        {/* Product content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Clickable product name */}
              <button
                type="button"
                onClick={openProduct}
                className="block max-w-full truncate text-left text-[12px] font-semibold leading-5 text-[#2C2C2C] transition-colors hover:text-[#B5697A] focus:outline-none focus-visible:underline"
              >
                {product.name}
              </button>
              <p className="text-[10px] text-slate-400">
                {variantLabel}
                {variant.packaging ? ` • ${variant.packaging}` : ""}
              </p>
            </div>

            {/* Remove item */}
            <button
              type="button"
              onClick={remove}
              aria-label={`Remove ${product.name} from cart`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8EDEF] text-[#B5697A] transition hover:bg-[#F0DCE1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
            >
              <Trash2 size={13} strokeWidth={1.8} />
            </button>
          </div>

          {/* Quantity + Price */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="inline-flex h-6 items-center rounded-lg border border-[#E8D9DD] bg-white">
              <button
                type="button"
                onClick={decrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Minus size={11} strokeWidth={2} />
              </button>

              <span className="min-w-[24px] text-center text-[10px] font-semibold text-[#2C2C2C]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increase}
                aria-label="Increase quantity"
                className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-[#B5697A]"
              >
                <Plus size={11} strokeWidth={2} />
              </button>
            </div>

            <p className="text-[13px] font-semibold text-[#2C2C2C]">
              ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartDrawerItem;