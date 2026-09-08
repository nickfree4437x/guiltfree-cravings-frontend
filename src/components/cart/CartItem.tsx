import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import type {
  CartItem as CartItemType,
} from "../../store/cartStore";

import CartItemQuantity from "./CartItemQuantity";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (
    productId: number,
    variantId: number,
    quantity: number
  ) => void;
  onRemove: (
    productId: number,
    variantId: number
  ) => void;
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const itemSubtotal =
    item.variant.price * item.quantity;

  const variantLabel = `${item.variant.quantity}${item.variant.unit}`;

  return (
    <article className="border border-gray-200 bg-white rounded-lg px-4 py-6 shadow-sm sm:px-5 sm:py-7">
      <div className="flex gap-5 sm:gap-6">
        <Link
          to={`/products/${item.product.id}`}
          className="group h-24 w-24 shrink-0 overflow-hidden rounded-xl  bg-white sm:h-28 sm:w-28"
          aria-label={`View ${item.product.name}`}
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            loading="lazy"
            className="h-full w-full object-contain p-1.5 transition duration-300"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                className="text-base font-semibold leading-6 text-slate-900 transition-colors sm:text-[16px]"
              >
                {item.product.name}
              </Link>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#f3e4d3] px-2.5 py-1 text-[10px] text-[#8b542f]">
                  {variantLabel}
                </span>

                <span className="text-xs capitalize text-slate-500">
                  {item.variant.packaging}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 max-w-2xl text-[12px] md:sm:text-[14.5px] font-[350] leading-5 text-slate-500 sm:leading-5 text-justify">
                {item.product.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onRemove(
                  item.product.id,
                  item.variant.id
                )
              }
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-500 transition-all duration-200 bg-red-50 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={`Remove ${item.product.name}, ${variantLabel}, from cart`}
              title="Remove item"
            >
              <Trash2
                className="h-[15px] w-[15px]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-[#eadfd3] bg-[#fdfbf8] px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Price
                </p>

                <p className="mt-1 text-sm font-semibold text-[#8b542f]">
                  ₹{item.variant.price}
                </p>
              </div>

              <CartItemQuantity
                productName={item.product.name}
                quantity={item.quantity}
                onDecrease={() =>
                  onUpdateQuantity(
                    item.product.id,
                    item.variant.id,
                    item.quantity - 1
                  )
                }
                onIncrease={() =>
                  onUpdateQuantity(
                    item.product.id,
                    item.variant.id,
                    item.quantity + 1
                  )
                }
              />

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Subtotal
                </p>

                <p className="mt-1 text-base font-semibold text-slate-900">
                  ₹{itemSubtotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;