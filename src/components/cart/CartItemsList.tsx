import { Trash2 } from "lucide-react";

import type {
  CartItem as CartItemType,
} from "../../store/cartStore";

import CartItem from "./CartItem";

interface CartItemsListProps {
  items: CartItemType[];
  onUpdateQuantity: (
    productId: number,
    variantId: number,
    quantity: number
  ) => void;
  onRemove: (
    productId: number,
    variantId: number
  ) => void;
  onClearCart: () => void;
}

function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
  onClearCart,
}: CartItemsListProps) {
  return (
    <section
      className="min-w-0"
      aria-label="Shopping cart items"
    >
      {/* =================================================
          CART ITEMS
      ================================================== */}

      <div className="space-y-4 sm:space-y-5">
        {items.map((item) => (
          <CartItem
            key={`${item.product.id}-${item.variant.id}`}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* =================================================
          CLEAR CART
      ================================================== */}

      <div className="flex justify-end pt-3 sm:pt-4">
        <button
          type="button"
          onClick={onClearCart}
          className="group inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] md:text-[13px] text-red-500 bg-red-50 transition-all duration-200 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Trash2
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Clear Cart</span>
        </button>
      </div>
    </section>
  );
}

export default CartItemsList;