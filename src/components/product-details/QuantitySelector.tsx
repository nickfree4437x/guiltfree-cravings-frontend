interface QuantitySelectorProps {
  productName: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function QuantitySelector({
  productName,
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4 border-b border-[#eadfd3] pb-7 sm:justify-start sm:gap-8">
      <div>
        <p className="text-sm font-bold text-slate-900">
          Quantity
        </p>

        <p className="mt-1 text-xs font-[350] text-slate-500">
          Choose how many you need.
        </p>
      </div>

      <div
        className="flex shrink-0 items-center rounded-full border border-[#d9c7b7] bg-white p-0"
        aria-label="Product quantity"
      >
        <button
          type="button"
          onClick={onDecrease}
          disabled={
            quantity === 1
          }
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-[#f8eee4] disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#8b542f]"
          aria-label={`Decrease quantity of ${productName}`}
        >
          −
        </button>

        <span
          className="flex min-w-10 items-center justify-center px-1 text-[12px] md:text-[14px] font-bold text-slate-900"
          aria-live="polite"
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-[#f8eee4] focus:outline-none focus:ring-2 focus:ring-[#8b542f]"
          aria-label={`Increase quantity of ${productName}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantitySelector;