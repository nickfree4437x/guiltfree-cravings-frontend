import { Link } from "react-router-dom";

function OrderSuccessActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

      <Link
        to="/orders"
        className="inline-flex items-center justify-center rounded-full bg-[#8b542f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
      >
        View My Orders
      </Link>

      <Link
        to="/#products"
        className="inline-flex items-center justify-center rounded-full border border-[#8b542f] bg-white px-7 py-3.5 text-sm font-semibold text-[#8b542f] transition hover:bg-[#fffaf5] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
      >
        Continue Shopping
      </Link>

    </div>
  );
}

export default OrderSuccessActions;