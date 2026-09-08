// src/components/admin/products/ProductTable.tsx

import type { AdminProduct } from "./types";
import {
  formatPrice,
  getStartingPrice,
} from "./productUtils";
import ProductStatusBadge from "./ProductStatusBadge";

interface ProductTableProps {
  products: AdminProduct[];
}

function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">
            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Product
            </th>

            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Variants
            </th>

            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Starting Price
            </th>

            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#f0e5db]">
          {products.map((product) => {
            const startingPrice =
              getStartingPrice(
                product.variants
              );

            return (
              <tr
                key={product.id}
                className="transition hover:bg-[#fffaf5]"
              >
                {/* PRODUCT */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd3] bg-[#fffaf5]">
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

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-1 max-w-sm truncate text-xs font-[350] text-slate-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* VARIANTS */}

                <td className="px-6 py-5">
                  <span className="text-sm font-semibold text-slate-700">
                    {product.variants.length}
                  </span>

                  <span className="ml-1 text-xs text-slate-400">
                    {product.variants.length ===
                    1
                      ? "variant"
                      : "variants"}
                  </span>
                </td>

                {/* PRICE */}

                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-slate-800">
                    {startingPrice !== null
                      ? `From ${formatPrice(
                          startingPrice
                        )}`
                      : "—"}
                  </span>
                </td>

                {/* STATUS */}

                <td className="px-6 py-5">
                  <ProductStatusBadge
                    isActive={
                      product.isActive
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;