import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  getMyOrders,
  type Order,
} from "../../api/orderApi";

import MyOrdersHeader from "../../components/orders/MyOrdersHeader";
import OrdersLoadingState from "../../components/orders/OrdersLoadingState";
import OrdersErrorState from "../../components/orders/OrdersErrorState";
import OrdersEmptyState from "../../components/orders/OrdersEmptyState";
import OrderCard from "../../components/orders/OrderCard";

/*
 * =========================================================
 * PAGINATION CONFIG
 * =========================================================
 */
const ORDERS_PER_PAGE = 5;

function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * =======================================================
   * PAGINATION STATE
   * =======================================================
   */
  const [currentPage, setCurrentPage] =
    useState(1);

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

        setCurrentPage(1);
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
   * PAGINATION LOGIC
   * =======================================================
   */

  const totalPages = Math.ceil(
    orders.length / ORDERS_PER_PAGE
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ORDERS_PER_PAGE;

    return orders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE
    );
  }, [orders, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Page numbers with ellipsis
   */
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(
        totalPages - 1,
        currentPage + 1
      );

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <main
      className="
        min-h-[calc(100vh-76px)]
        bg-[#FFF9F5]
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
                {paginatedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </section>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <div
                  className="
                    mx-auto
                    mt-10
                    flex
                    max-w-5xl
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                  aria-label="Pagination"
                >
                  {/* ===== PREVIOUS ===== */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#EADFD3]
                      bg-white
                      text-[#A98B6F]
                      hover:border-[#B5697A]
                      hover:text-[#B5697A]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:hover:border-[#EADFD3]
                      disabled:hover:text-[#A98B6F]
                      sm:h-11
                      sm:w-11
                    "
                  >
                    <FaChevronLeft className="h-3 w-3" />
                  </button>

                  {/* ===== PAGE NUMBERS ===== */}
                  {pageNumbers.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="
                            flex
                            h-10
                            w-8
                            items-center
                            justify-center
                            text-[14px]
                            font-medium
                            text-[#A98B6F]
                            sm:h-11
                            sm:w-10
                          "
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive =
                      page === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={
                          isActive ? "page" : undefined
                        }
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-lg
                          border
                          text-[13px]
                          focus:outline-none
                          sm:h-11
                          sm:w-11
                          sm:text-[14px]
                          ${
                            isActive
                              ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                              : "border-[#EADFD3] bg-white text-[#2C2C2C] hover:border-[#B5697A] hover:text-[#B5697A]"
                          }
                        `}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* ===== NEXT ===== */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    aria-label="Next page"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#EADFD3]
                      bg-white
                      text-[#A98B6F]
                      hover:border-[#B5697A]
                      hover:text-[#B5697A]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:hover:border-[#EADFD3]
                      disabled:hover:text-[#A98B6F]
                      sm:h-11
                      sm:w-11
                    "
                  >
                    <FaChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    </main>
  );
}

export default MyOrdersPage;