import { Link } from "react-router-dom";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";

function OrderSuccessActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      {/* View Orders */}
      <Link
        to="/orders"
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#B5697A] px-7 py-3.5 text-sm  text-white shadow-sm hover:bg-[#9F5668] hover:shadow-md focus:outline-none sm:w-auto"
      >
        <Package className="h-4 w-4" />
        View My Orders
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>

      {/* Continue Shopping */}
      <Link
        to="/#products"
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#eadfd3] bg-white px-7 py-3.5 text-sm text-[#8b542f] hover:border-[#B5697A] hover:bg-[#fff8f7] focus:outline-none sm:w-auto"
      >
        <ShoppingBag className="h-4 w-4" />
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccessActions;