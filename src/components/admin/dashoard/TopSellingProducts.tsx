// src/components/admin/dashoard/TopSellingProducts.tsx

import { Package } from "lucide-react";

import type { AdminTopSellingProduct } from "../../../api/adminDashboardApi";

// ─── Types ────────────────────────────────────────────────
interface TopSellingProductsProps {
  products: AdminTopSellingProduct[];
}

// ─── Helpers ──────────────────────────────────────────────
const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────
function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-[#EAD9DC] bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-[#EFE3D2] bg-white px-4 py-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-[16px] md:text-[18px] font-semibold tracking-[-0.01em] text-[#1F4A2E]">
            Top Selling Products
          </h2>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#EAD9DC] bg-white px-2.5 py-1 shadow-sm sm:gap-2 sm:px-3 sm:py-1.5">
          <span className="text-[10px] tracking-wide text-[#824958] sm:text-[11px]">
            Top {Math.min(products.length, 5)}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#EAD9DC] bg-[#FFFAF8] text-[#824958]">
            <Package className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
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
              <div key={product.productId} className="group flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-7 sm:py-5">
                {/* Rank */}
                <div className="flex w-6 shrink-0 justify-center sm:w-7">
                  <span className="text-xs tabular-nums text-slate-600">
                    {String(rank).padStart(2, "0")}
                  </span>
                </div>

                {/* Product Image */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EAD9DC] bg-white sm:h-14 sm:w-14">
                  {product.image ? (
                    <img src={product.image} alt={product.productName} loading="lazy" className="h-full w-full object-contain p-1.5 transition-transform" />
                  ) : (
                    <Package className="h-5 w-5 text-[#B58B95]" aria-hidden="true" />
                  )}
                </div>

                {/* Product Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm text-[#211A1C] transition-colors" title={product.productName}>
                      {product.productName}
                    </h3>
                    {rank === 1 && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EAD9DC] bg-[#FBF0F2] px-2 py-0.5 text-[10px] tracking-wide text-[#824958]">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs text-slate-500">
                      {product.unitsSold.toLocaleString("en-IN")} {product.unitsSold === 1 ? "unit" : "units"} sold
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#D9C5CA]" aria-hidden="true" />
                    <span className="text-[11px] text-[#824958]">Product #{product.productId}</span>
                  </div>
                  
                  {/* Mobile Revenue */}
                  <p className="mt-1.5 text-xs text-[#824958] sm:hidden">
                    {formatCurrency(product.revenue)} Revenue
                  </p>
                </div>

                {/* Desktop Revenue */}
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[10px] tracking-[0.14em] text-slate-600">Revenue</p>
                  <p className="mt-0 text-sm font-bold tabular-nums text-[#211A1C]">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {products.length > 0 && (
        <div className="border-t border-[#F0E3E5] bg-[#FFFAF8] px-5 py-4 sm:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#75676B]">
              Showing {products.length} top-selling {products.length === 1 ? "product" : "products"}.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#824958]">
              Sales Performance
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TopSellingProducts;