interface CartItemQuantityProps {
  productName: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function CartItemQuantity({
  productName,
  quantity,
  onDecrease,
  onIncrease,
}: CartItemQuantityProps) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
        Quantity
      </p>

      <div
        className="inline-flex items-center overflow-hidden rounded-2xl border border-[#d9c7b7] bg-white"
        aria-label={`Quantity for ${productName}`}
      >
        {/* =================================================
            DECREASE
        ================================================== */}

        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity === 1}
          className="flex h-6 w-8 items-center justify-center text-base leading-none text-slate-600 transition-colors hover:bg-[#f5eadf] hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
          aria-label={`Decrease quantity of ${productName}`}
        >
          −
        </button>

        {/* =================================================
            CURRENT QUANTITY
        ================================================== */}

        <span
          className="flex h-6 min-w-9 items-center justify-center border-x border-[#eee4dc] px-2 text-sm font-semibold text-slate-900"
          aria-live="polite"
        >
          {quantity}
        </span>

        {/* =================================================
            INCREASE
        ================================================== */}

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-6 w-8 items-center justify-center text-base leading-none text-slate-600 transition-colors hover:bg-[#f5eadf] hover:text-[#8b542f] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8b542f]"
          aria-label={`Increase quantity of ${productName}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CartItemQuantity;