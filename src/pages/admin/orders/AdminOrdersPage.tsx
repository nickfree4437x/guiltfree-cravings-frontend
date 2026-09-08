// src/pages/admin/orders/AdminOrdersPage.tsx

import {
  useMemo,
  useState,
} from "react";

import OrdersPageHeader from "../../../components/admin/orders/OrdersPageHeader";
import OrderSummaryCards from "../../../components/admin/orders/OrderSummaryCards";
import OrdersToolbar from "../../../components/admin/orders/OrdersToolbar";
import OrdersList from "../../../components/admin/orders/OrdersList";

import type {
  AdminOrder,
} from "../../../components/admin/orders/types";

/*
 * =========================================================
 * ADMIN ORDERS PAGE
 * =========================================================
 *
 * UI is ready for the admin order listing API.
 *
 * No delivery functionality is included.
 * No Razorpay functionality is included here.
 *
 * =========================================================
 */

function AdminOrdersPage() {
  const [search, setSearch] =
    useState("");

  /*
   * =======================================================
   * ORDERS
   * =======================================================
   *
   * API integration ke baad ye state
   * backend se populate hogi.
   */

  const [orders] =
    useState<AdminOrder[]>([]);

  /*
   * =======================================================
   * SUMMARY COUNTS
   * =======================================================
   */

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "PENDING"
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        "PAID"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "COMPLETED"
    ).length;

  /*
   * =======================================================
   * SEARCH
   * =======================================================
   */

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return orders;
      }

      return orders.filter(
        (order) => {
          return (
            order.orderNumber
              .toLowerCase()
              .includes(query) ||
            order.customerName
              .toLowerCase()
              .includes(query) ||
            order.customerPhone
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [orders, search]);

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <OrdersPageHeader />

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <OrderSummaryCards
          totalOrders={
            totalOrders
          }
          pendingOrders={
            pendingOrders
          }
          paidOrders={
            paidOrders
          }
          completedOrders={
            completedOrders
          }
        />

        {/* =================================================
            ORDERS SECTION
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <OrdersToolbar
            search={search}
            filteredCount={
              filteredOrders.length
            }
            onSearchChange={
              setSearch
            }
          />

          {/* =================================================
              ORDERS LIST
          ================================================= */}

          <OrdersList
            orders={
              filteredOrders
            }
            hasSearch={
              Boolean(
                search.trim()
              )
            }
            onClearSearch={() =>
              setSearch("")
            }
          />

        </section>

      </div>
    </div>
  );
}

export default AdminOrdersPage;