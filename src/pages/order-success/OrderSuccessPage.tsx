import {
  useLocation,
} from "react-router-dom";

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

  /*
   * =======================================================
   * LOCATION STATE
   * =======================================================
   */

  const locationState =
    location.state as
      | OrderSuccessLocationState
      | null;

  /*
   * =======================================================
   * ORDER
   * =======================================================
   */

  const order =
    locationState?.order;

  /*
   * =======================================================
   * ORDER INFORMATION MISSING
   * =======================================================
   *
   * Prevent users from directly opening:
   *
   * /order-success
   *
   * without a valid order.
   */

  if (!order) {
    return <OrderSuccessMissing />;
  }

  /*
   * =======================================================
   * SUCCESS PAGE
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <OrderSuccessHeader />

        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <OrderSuccessInfo
          order={order}
        />

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <OrderSuccessSummary
          order={order}
        />

        {/* =================================================
            PAYMENT NOTICE
        ================================================= */}

        <OrderSuccessPaymentNotice />

        {/* =================================================
            ACTIONS
        ================================================= */}

        <OrderSuccessActions />

      </div>

    </main>
  );
}

export default OrderSuccessPage;