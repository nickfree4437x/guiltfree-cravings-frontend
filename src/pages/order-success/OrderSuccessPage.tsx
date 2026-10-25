import { useLocation } from "react-router-dom";

import type { Order } from "../../api/orderApi";

import OrderSuccessMissing from "../../components/order-success/OrderSuccessMissing";
import OrderSuccessHeader from "../../components/order-success/OrderSuccessHeader";
import OrderSuccessInfo from "../../components/order-success/OrderSuccessInfo";
import OrderSuccessSummary from "../../components/order-success/OrderSuccessSummary";
import OrderSuccessPaymentNotice from "../../components/order-success/OrderSuccessPaymentNotice";
import OrderSuccessActions from "../../components/order-success/OrderSuccessActions";

// ─── Types ────────────────────────────────────────────────
interface OrderSuccessLocationState {
  order?: Order;
}

// ─── Component ────────────────────────────────────────────
function OrderSuccessPage() {
  const location = useLocation();
  const locationState = location.state as OrderSuccessLocationState | null;
  const order = locationState?.order;

  // Fallback when order data is missing from navigation state
  if (!order) return <OrderSuccessMissing />;

  // ─── Render ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <OrderSuccessHeader />
        <OrderSuccessInfo order={order} />
        <OrderSuccessSummary order={order} />
        <OrderSuccessPaymentNotice />
        <OrderSuccessActions />
      </div>
    </main>
  );
}

export default OrderSuccessPage;