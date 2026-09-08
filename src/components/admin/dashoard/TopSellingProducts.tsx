// src/components/admin/dashoard/TopSellingProducts.tsx

import {
  ArrowUpRight,
  Package,
  TrendingUp,
} from "lucide-react";

import type {
  AdminTopSellingProduct,
} from "../../../api/adminDashboardApi";

interface TopSellingProductsProps {
  products: AdminTopSellingProduct[];
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

function TopSellingProducts({
  products,
}: TopSellingProductsProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex flex-col gap-4 border-b border-[#eadfd3] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold text-slate-900">
              Top Selling Products
            </h2>
          </div>

          <p className="mt-0 text-sm text-slate-500">
            Best performing products based on successful sales.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8b542f]">
          <span>Top 5</span>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}
      {products.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fffaf5] text-[#8b542f]">
            <Package
              className="h-5 w-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <p className="mt-4 text-sm text-slate-700">
            No sales data available yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Top selling products will appear here once customers
            complete orders.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#f1e9e1]">
          {products.map((product, index) => {
            const rank = index + 1;

            return (
              <div
                key={product.productId}
                className="group flex items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-[#fffaf5] sm:px-7"
              >
                {/* =================================================
                    RANK
                ================================================= */}
                <div className="flex w-7 shrink-0 justify-center">
                  <span
                    className={`text-xs font-bold ${
                      rank === 1
                        ? "text-[#8b542f]"
                        : "text-slate-400"
                    }`}
                  >
                    {String(rank).padStart(2, "0")}
                  </span>
                </div>

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#eadfd3] bg-white">
                  <img
                    src={product.image}
                    alt={product.productName}
                    loading="lazy"
                    className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* =================================================
                    PRODUCT INFO
                ================================================= */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {product.productName}
                    </h3>

                    {rank === 1 && (
                      <span className="hidden shrink-0 rounded-full bg-[#f3e4d3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8b542f] sm:inline-flex">
                        Best Seller
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {product.unitsSold.toLocaleString("en-IN")}{" "}
                      {product.unitsSold === 1
                        ? "unit"
                        : "units"}{" "}
                      sold
                    </span>

                    <span
                      className="h-1 w-1 rounded-full bg-slate-300"
                      aria-hidden="true"
                    />

                    <span className="text-xs text-slate-400">
                      Product #{product.productId}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    REVENUE
                ================================================= */}
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Revenue
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>

                {/* =================================================
                    ACTION INDICATOR
                ================================================= */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fffaf5] text-slate-300 transition-all duration-200 group-hover:bg-[#f3e4d3] group-hover:text-[#8b542f]">
                  <ArrowUpRight
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}
      {products.length > 0 && (
        <div className="border-t border-[#eadfd3] bg-[#fffaf5] px-6 py-3.5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Showing the top {products.length} selling{" "}
              {products.length === 1 ? "product" : "products"}.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8b542f]">
              <span>Sales performance</span>

              <TrendingUp
                className="h-3.5 w-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TopSellingProducts;