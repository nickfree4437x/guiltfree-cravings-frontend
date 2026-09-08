// src/components/admin/products/ProductMobileList.tsx

import type { AdminProduct } from "./types";
import {
  formatPrice,
  getStartingPrice,
} from "./productUtils";

interface ProductMobileListProps {
  products: AdminProduct[];
}

function ProductMobileList({
  products,
}: ProductMobileListProps) {
  return (
    <div className="divide-y divide-[#f0e5db] md:hidden">
      {products.map((product) => {
        const startingPrice =
          getStartingPrice(
            product.variants
          );

        return (
          <article
            key={product.id}
            className="p-5"
          >
            <div className="flex gap-4">
              {/* IMAGE */}

              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd3] bg-[#fffaf5]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg text-[#c9a98d]">
                    
                  </div>
                )}
              </div>

              {/* BASIC INFO */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-900">
                      {product.name}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {product.description}
                    </p>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      product.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {product.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRODUCT META */}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#fffaf5] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Variants
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {product.variants.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fffaf5] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Starting Price
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {startingPrice !== null
                    ? formatPrice(
                        startingPrice
                      )
                    : "—"}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductMobileList;