// src/pages/admin/analytics/AdminAnalyticsPage.tsx

import { useMemo, useState } from "react";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type AnalyticsPeriod =
  | "7D"
  | "30D"
  | "90D"
  | "1Y";

interface SalesData {
  day: string;
  sales: number;
  orders: number;
}

interface TopProduct {
  name: string;
  orders: number;
  revenue: number;
}


/*
 * =========================================================
 * ANALYTICS DATA
 * =========================================================
 *
 * Real analytics data will be connected through the
 * backend API.
 *
 * No dummy analytics records are used here.
 * =========================================================
 */

const salesData: Record<
  AnalyticsPeriod,
  SalesData[]
> = {
  "7D": [],
  "30D": [],
  "90D": [],
  "1Y": [],
};


/*
 * =========================================================
 * TOP PRODUCTS
 * =========================================================
 *
 * Real product performance data will come from
 * the backend analytics API.
 * =========================================================
 */

const topProducts: TopProduct[] = [];


/*
 * =========================================================
 * ADMIN ANALYTICS PAGE
 * =========================================================
 */

function AdminAnalyticsPage() {
  const [
    period,
    setPeriod,
  ] = useState<AnalyticsPeriod>("30D");


  /*
   * =======================================================
   * CURRENT DATA
   * =======================================================
   */

  const currentData =
    salesData[period];


  /*
   * =======================================================
   * ANALYTICS CALCULATIONS
   * =======================================================
   */

  const totalRevenue =
    useMemo(
      () =>
        currentData.reduce(
          (total, item) =>
            total + item.sales,
          0
        ),
      [currentData]
    );


  const totalOrders =
    useMemo(
      () =>
        currentData.reduce(
          (total, item) =>
            total + item.orders,
          0
        ),
      [currentData]
    );


  const averageOrderValue =
    totalOrders > 0
      ? Math.round(
          totalRevenue /
            totalOrders
        )
      : 0;


  const highestSales =
    currentData.length > 0
      ? Math.max(
          ...currentData.map(
            (item) =>
              item.sales
          )
        )
      : 0;


  /*
   * =======================================================
   * MAX BAR HEIGHT
   * =======================================================
   */

  const maxSales =
    currentData.length > 0
      ? Math.max(
          ...currentData.map(
            (item) =>
              item.sales
          )
        )
      : 0;


  /*
   * =======================================================
   * HAS ANALYTICS DATA
   * =======================================================
   */

  const hasSalesData =
    currentData.length > 0;

  const hasTopProducts =
    topProducts.length > 0;


  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Analytics
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Store Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor sales, orders,
              revenue and product
              performance from your
              admin panel.
            </p>

          </div>


          {/* =================================================
              PERIOD FILTER
          ================================================= */}

          <div className="flex rounded-2xl border border-[#eadfd3] bg-white p-1.5 shadow-sm">

            {(
              [
                ["7D", "7 Days"],
                ["30D", "30 Days"],
                ["90D", "90 Days"],
                ["1Y", "1 Year"],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setPeriod(
                      value
                    )
                  }
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4",
                    period === value
                      ? "bg-[#8b542f] text-white"
                      : "text-slate-500 hover:bg-[#fffaf5] hover:text-[#8b542f]",
                  ].join(" ")}
                  title={label}
                >
                  {value}
                </button>
              )
            )}

          </div>

        </div>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* REVENUE */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Revenue
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                ₹
              </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No data available
            </p>

          </div>


          {/* ORDERS */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Orders
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                #
              </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {totalOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No data available
            </p>

          </div>


          {/* AOV */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Average Order
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                A
              </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              ₹
              {averageOrderValue.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Based on available orders
            </p>

          </div>


          {/* PEAK SALES */}

          <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Peak Sales
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                ↑
              </span>

            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              ₹
              {highestSales.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Highest period sales
            </p>

          </div>

        </div>


        {/* =================================================
            SALES + ORDER OVERVIEW
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">

          {/* =================================================
              SALES CHART
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Sales Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Revenue performance for
                  the selected period.
                </p>

              </div>


              <div className="rounded-xl bg-[#fffaf5] px-3 py-2">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total
                </p>

                <p className="mt-1 text-sm font-bold text-[#8b542f]">
                  ₹
                  {totalRevenue.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

            </div>


            {/* =================================================
                CHART
            ================================================= */}

            <div className="mt-8">

              {hasSalesData ? (

                <div className="flex h-64 items-end gap-3 sm:gap-5">

                  {currentData.map(
                    (item) => {

                      const height =
                        maxSales > 0
                          ? Math.max(
                              (item.sales /
                                maxSales) *
                                100,
                              8
                            )
                          : 8;

                      return (
                        <div
                          key={
                            item.day
                          }
                          className="group flex h-full flex-1 flex-col items-center justify-end"
                        >

                          {/* TOOLTIP */}

                          <div className="mb-2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                            ₹
                            {item.sales.toLocaleString(
                              "en-IN"
                            )}
                          </div>


                          {/* BAR */}

                          <div
                            className="w-full max-w-14 rounded-t-xl bg-[#8b542f] transition-all duration-300 group-hover:bg-[#6f4226]"
                            style={{
                              height: `${height}%`,
                            }}
                          />


                          {/* LABEL */}

                          <p className="mt-3 text-[10px] font-semibold text-slate-400 sm:text-xs">
                            {
                              item.day
                            }
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#eadfd3] bg-[#fffaf5] px-6 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-[#8b542f] shadow-sm">
                    ₹
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    No sales data available
                  </h3>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    Sales performance
                    will appear here
                    once analytics data
                    is available.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current order performance.
            </p>


            <div className="mt-7 space-y-5">

              {/* COMPLETED */}

              <div>

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-700">
                    Completed
                  </span>

                  <span className="text-sm font-bold text-slate-500">
                    0%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

              </div>


              {/* PROCESSING */}

              <div>

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-700">
                    Processing
                  </span>

                  <span className="text-sm font-bold text-slate-500">
                    0%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

              </div>


              {/* PENDING */}

              <div>

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-700">
                    Pending
                  </span>

                  <span className="text-sm font-bold text-slate-500">
                    0%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

              </div>


              {/* CANCELLED */}

              <div>

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-700">
                    Cancelled
                  </span>

                  <span className="text-sm font-bold text-slate-500">
                    0%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* =================================================
            TOP PRODUCTS
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

          <div className="border-b border-[#eadfd3] p-5 sm:p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Top Performing Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products generating the most
              sales.
            </p>

          </div>


          {hasTopProducts ? (

            <div className="divide-y divide-[#eadfd3]">

              {topProducts.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      product.name
                    }
                    className="flex items-center gap-4 px-5 py-5 sm:px-6"
                  >

                    {/* RANK */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                      {index + 1}
                    </div>


                    {/* PRODUCT */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold text-slate-900">
                        {
                          product.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          product.orders
                        }{" "}
                        orders
                      </p>

                    </div>


                    {/* REVENUE */}

                    <div className="text-right">

                      <p className="text-sm font-bold text-slate-900">
                        ₹
                        {product.revenue.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Revenue
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          ) : (

            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
                #
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-900">
                No product data available
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Product performance
                will appear here once
                analytics data is
                available.
              </p>

            </div>

          )}

        </section>


        {/* =================================================
            NOTE
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e8] text-sm font-bold text-[#8b542f]">
              i
            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Analytics Data
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Analytics will be connected
                with actual order and
                payment records once the
                admin analytics API is
                implemented.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminAnalyticsPage;