import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import type { CartItem as CartItemType } from "../../../store/cartStore";

import ProductCardImage from "../../product/card/ProductCardImage";

interface CartDrawerItemProps {
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

function CartDrawerItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartDrawerItemProps) {
  const {
    product,
    variant,
    quantity,
  } = item;

  /*
   * =========================================================
   * TOTAL
   * =========================================================
   */

  const itemTotal =
    Number(variant.price) * quantity;

  /*
   * =========================================================
   * VARIANT LABEL
   * =========================================================
   */

  const variantLabel = `${variant.quantity}${variant.unit}`;

  /*
   * =========================================================
   * DECREASE
   * =========================================================
   */

  const handleDecrease = () => {
    if (quantity <= 1) {
      return;
    }

    onUpdateQuantity(
      product.id,
      variant.id,
      quantity - 1
    );
  };

  /*
   * =========================================================
   * INCREASE
   * =========================================================
   */

  const handleIncrease = () => {
    onUpdateQuantity(
      product.id,
      variant.id,
      quantity + 1
    );
  };

  /*
   * =========================================================
   * REMOVE
   * =========================================================
   */

  const handleRemove = () => {
    onRemove(
      product.id,
      variant.id
    );
  };

  return (
    <article
      className="
        rounded-lg
        border
        border-[#F0E1E5]
        bg-[#FFFCFC]
        p-3
      "
    >
      <div className="flex gap-3">
        {/* =================================================
            IMAGE
        ================================================== */}

        <div
          className="
            h-[80px]
            w-[80px]
            shrink-0
            overflow-hidden
          "
        >
          <ProductCardImage
            product={product}
            packaging={
              variant.packaging as
                | "Plastic Box"
                | "Glass Jar"
                | "Cardboard Box"
            }
            compact
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-[12px]
                  font-semibold
                  leading-5
                  text-[#2C2C2C]
                "
              >
                {product.name}
              </h3>

              <p
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                {variantLabel}
                {variant.packaging
                  ? ` • ${variant.packaging}`
                  : ""}
              </p>
            </div>

            {/* =================================================
                REMOVE
            ================================================== */}

            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${product.name} from cart`}
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                transition
                bg-[#F8EDEF]
              text-[#B5697A]
              "
            >
              <Trash2
                size={13}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* =================================================
              BOTTOM ROW
          ================================================== */}

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              gap-3
            "
          >
            {/* =================================================
                QUANTITY
            ================================================== */}

            <div
              className="
                inline-flex
                h-6
                items-center
                rounded-lg
                border
                border-[#E8D9DD]
                bg-white
              "
            >
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  text-slate-500
                  transition
                  hover:text-[#B5697A]
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                "
              >
                <Minus
                  size={11}
                  strokeWidth={2}
                />
              </button>

              <span
                className="
                  min-w-[24px]
                  text-center
                  text-[10px]
                  font-semibold
                  text-[#2C2C2C]
                "
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  text-slate-500
                  transition
                  hover:text-[#B5697A]
                "
              >
                <Plus
                  size={11}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* =================================================
                PRICE
            ================================================== */}

            <p
              className="
                text-[13px]
                font-semibold
                text-[#2C2C2C]
              "
            >
              ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartDrawerItem;