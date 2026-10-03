import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMyOrders,
  type Order,
} from "../../api/orderApi";

import MyOrdersHeader from "../../components/orders/MyOrdersHeader";
import OrdersLoadingState from "../../components/orders/OrdersLoadingState";
import OrdersErrorState from "../../components/orders/OrdersErrorState";
import OrdersEmptyState from "../../components/orders/OrdersEmptyState";
import OrderCard from "../../components/orders/OrderCard";

function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * =======================================================
   * FETCH ORDERS
   * =======================================================
   */

  const loadOrders = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getMyOrders();

        setOrders(data);
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );

        setError(
          "Unable to load your orders right now. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /*
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <main
      className="
        min-h-[calc(100vh-76px)]
        bg-white
        px-4
        pb-16
        pt-24
        sm:px-6
        sm:pb-20
        sm:pt-24
        lg:px-8
        lg:pt-28
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <MyOrdersHeader />

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <OrdersLoadingState />
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!isLoading && error && (
          <OrdersErrorState
            message={error}
            onRetry={() => {
              void loadOrders();
            }}
          />
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading &&
          !error &&
          orders.length === 0 && (
            <OrdersEmptyState />
          )}

        {/* =================================================
            ORDERS
        ================================================= */}

        {!isLoading &&
          !error &&
          orders.length > 0 && (
            <>

              <section
                aria-label="Your orders"
                className="
                  mx-auto
                  mt-5
                  max-w-5xl
                  space-y-5
                "
              >
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </section>
            </>
          )}

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        {!isLoading && (
          <div className="mt-8 text-center">
            <p className="text-[10px] tracking-wide text-[#A59485] sm:text-[11px]">
              Thank you for choosing GuiltFree
              Cravings.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrdersPage;