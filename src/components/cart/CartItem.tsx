
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

  const variantLabel =
    `${item.variant.quantity}${item.variant.unit}`;

  /*
   * Use only the image belonging to the selected packaging.
   * Do not silently fall back to the Regular product image.
   */
  const packaging = item.variant.packaging;

  const packagingImages =
    packaging === "Glass Jar"
      ? item.product.glassJarImages
      : packaging === "Cardboard Box"
        ? item.product.cardboardBoxImages
        : item.product.regularImages;

  const legacyPackagingImage =
    packaging === "Glass Jar"
      ? item.product.glassJarImage
      : packaging === "Cardboard Box"
        ? item.product.cardboardBoxImage
        : item.product.image;

  const packagingImage =
    (Array.isArray(packagingImages)
      ? packagingImages.find(
          (image) =>
            typeof image === "string" &&
            image.trim().length > 0
        )
      : undefined) ||
    (typeof legacyPackagingImage === "string" &&
    legacyPackagingImage.trim().length > 0
      ? legacyPackagingImage
      : undefined);

  return (
    <article className="rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm sm:px-5 sm:py-7">
      <div className="flex gap-5 sm:gap-6">
        {/* PRODUCT IMAGE */}
        <Link
          to={`/products/${item.product.id}`}
          state={{ packaging }}
          className="group h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FBF7F2] sm:h-28 sm:w-28"
          aria-label={`View ${item.product.name}`}
        >
          {packagingImage ? (
            <img
              src={packagingImage}
              alt={`${item.product.name} - ${packaging}`}
              loading="lazy"
              className="h-full w-full object-contain p-1.5 transition duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-[10px] text-[#8B7A6C]">
              {packaging}
              <br />
              Image unavailable
            </div>
          )}
        </Link>

        {/* PRODUCT DETAILS */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                state={{ packaging }}
                className="text-base font-semibold leading-6 text-slate-900 transition-colors sm:text-[16px]"
              >
                {item.product.name}
              </Link>

              {/* VARIANT DETAILS */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#f3e4d3] px-2.5 py-1 text-[10px] text-[#8b542f]">
                  {variantLabel}
                </span>

                <span className="text-xs text-slate-500">
                  {packaging}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-2 line-clamp-2 max-w-2xl text-justify text-[12px] font-[350] leading-5 text-slate-500 sm:text-[14.5px] sm:leading-5">
                {item.product.description}
              </p>
            </div>

            {/* REMOVE ITEM */}
            <button
              type="button"
              onClick={() =>
                onRemove(
                  item.product.id,
                  item.variant.id
                )
              }
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

          {/* PRICE, QUANTITY AND SUBTOTAL */}
          <div className="mt-5 rounded-lg border border-[#eadfd3] bg-[#fdfbf8] px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              {/* PRICE */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Price
                </p>

                <p className="mt-1 text-sm font-semibold text-[#8b542f]">
                  ₹{item.variant.price}
                </p>
              </div>

              {/* QUANTITY */}
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

              {/* SUBTOTAL */}
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
