import { useLocation } from "react-router-dom";

import type { Order } from "../../api/orderApi";

import OrderSuccessMissing from "../../components/order-success/OrderSuccessMissing";
import OrderSuccessHeader from "../../components/order-success/OrderSuccessHeader";
import OrderSuccessInfo from "../../components/order-success/OrderSuccessInfo";
import OrderSuccessSummary from "../../components/order-success/OrderSuccessSummary";
import OrderSuccessPaymentNotice from "../../components/order-success/OrderSuccessPaymentNotice";
import OrderSuccessActions from "../../components/order-success/OrderSuccessActions";

/*
 * =========================================================
 * LOCATION STATE
 * =========================================================
 */

interface OrderSuccessLocationState {
  order?: Order;
}

/*
 * =========================================================
 * ORDER SUCCESS PAGE
 * =========================================================
 */

function OrderSuccessPage() {
  const location = useLocation();

  const locationState =
    location.state as OrderSuccessLocationState | null;

  const order = locationState?.order;

  /*
   * =======================================================
   * ORDER INFORMATION MISSING
   * =======================================================
   *
   * Show the fallback UI when order information is
   * unavailable in the current navigation state.
   */

  if (!order) {
    return <OrderSuccessMissing />;
  }

  /*
   * =======================================================
   * ORDER SUCCESS CONTENT
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-4xl">
        {/* Success Header */}
        <OrderSuccessHeader />

        {/* Order Information */}
        <OrderSuccessInfo order={order} />

        {/* Order Summary */}
        <OrderSuccessSummary order={order} />

        {/* Payment Confirmation Notice */}
        <OrderSuccessPaymentNotice />

        {/* Navigation Actions */}
        <OrderSuccessActions />
      </div>
    </main>
  );
}

export default OrderSuccessPage;