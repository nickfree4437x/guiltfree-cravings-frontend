// src/components/admin/dashoard/TopSellingProducts.tsx

import {
  ArrowUpRight,
  Package,
  TrendingUp,
  Trophy,
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
    <section className="mt-8 overflow-hidden rounded-xl border border-[#EAD9DC] bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-[#EFE3D2] bg-[#fffbfc] px-4 py-4 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-[16px] md:text-[18px] font-semibold tracking-[-0.01em] text-[#1F4A2E]">
            Top Selling Products
          </h2>
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#EAD9DC] bg-white px-2.5 py-1 shadow-sm sm:gap-2 sm:px-3 sm:py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C9788B] sm:h-2 sm:w-2" />
          <span className="text-[10px] tracking-wide text-[#824958] sm:text-[11px]">
            Top {Math.min(products.length, 5)}
          </span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#EAD9DC] bg-[#FFFAF8] text-[#824958]">
            <Package
              className="h-5 w-5"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-600">
            No sales data available yet
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-[11px] md:text-[12px] leading-relaxed text-gray-500">
            Top products will appear here after completed orders.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F3E9EB]">
          {products.map((product, index) => {
            const rank = index + 1;

            return (
              <div
                key={product.productId}
                className="group flex items-center gap-3 px-4 py-4 transition-colors duration-200 hover:bg-[#FFFAF8] sm:gap-4 sm:px-7 sm:py-5"
              >
                {/* RANK */}
                <div className="flex w-6 shrink-0 justify-center sm:w-7">
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      rank === 1
                        ? "text-[#824958]"
                        : "text-[#A99A9E]"
                    }`}
                  >
                    {String(rank).padStart(2, "0")}
                  </span>
                </div>

                {/* PRODUCT IMAGE */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EAD9DC] bg-white sm:h-14 sm:w-14">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.productName}
                      loading="lazy"
                      className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Package
                      className="h-5 w-5 text-[#B58B95]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className="truncate text-sm text-[#211A1C] transition-colors group-hover:text-[#824958]"
                      title={product.productName}
                    >
                      {product.productName}
                    </h3>

                    {rank === 1 && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EAD9DC] bg-[#FBF0F2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#824958]">
                        <Trophy className="h-3 w-3" />
                        Best Seller
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-medium text-[#75676B]">
                      {product.unitsSold.toLocaleString("en-IN")}{" "}
                      {product.unitsSold === 1 ? "unit" : "units"} sold
                    </span>

                    <span
                      className="h-1 w-1 rounded-full bg-[#D9C5CA]"
                      aria-hidden="true"
                    />

                    <span className="text-[11px] text-[#A09296]">
                      Product #{product.productId}
                    </span>
                  </div>

                  {/* MOBILE REVENUE */}
                  <p className="mt-1.5 text-xs font-bold text-[#824958] sm:hidden">
                    {formatCurrency(product.revenue)} revenue
                  </p>
                </div>

                {/* DESKTOP REVENUE */}
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A09296]">
                    Revenue
                  </p>

                  <p className="mt-1 text-sm font-bold tabular-nums text-[#211A1C]">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>

                {/* DECORATIVE INDICATOR */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFFAF8] text-[#B9A6AB] transition-all duration-200 group-hover:bg-[#FBF0F2] group-hover:text-[#824958]">
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

      {/* FOOTER */}
      {products.length > 0 && (
        <div className="border-t border-[#F0E3E5] bg-[#FFFAF8] px-5 py-4 sm:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#75676B]">
              Showing {products.length} top-selling{" "}
              {products.length === 1 ? "product" : "products"}.
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs text-[#824958]">
              <TrendingUp
                className="h-4 w-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              Sales Performance
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TopSellingProducts;