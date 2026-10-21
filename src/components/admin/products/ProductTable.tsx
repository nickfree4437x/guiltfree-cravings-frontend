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
        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            <th className="px-6 py-2.5 text-left">
              <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Product
              </span>
            </th>

            <th className="px-6 py-2.5 text-left">
              <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Variants
              </span>
            </th>

            <th className="px-6 py-2.5 text-left">
              <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Starting Price
              </span>
            </th>

            <th className="px-6 py-2.5 text-left">
              <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Status
              </span>
            </th>
          </tr>
        </thead>

        {/* =================================================
            TABLE BODY
        ================================================= */}

        <tbody>
          {products.map((product) => {
            const startingPrice =
              getStartingPrice(product.variants);

            return (
              <tr
                key={product.id}
                className="
                  border-b
                  border-[#F1E9E1]
                  transition-colors
                  duration-200
                  last:border-0
                  hover:bg-[#fffbfc]
                "
              >
                {/* =================================================
                    PRODUCT
                ================================================= */}

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#FBECEF] text-[#B5697A]">
                          <span className="text-lg font-medium">
                            —
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-gray-600">
                        {product.name}
                      </p>

                      {/* <p className="mt-1 max-w-sm truncate text-[12px] leading-5 text-[#9A8D82]">
                        {product.description}
                      </p> */}
                    </div>
                  </div>
                </td>

                {/* =================================================
                    VARIANTS
                ================================================= */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-gray-600">
                      {product.variants.length}
                    </span>

                    <span className="text-[12px] text-gray-500">
                      {product.variants.length === 1
                        ? "variant"
                        : "variants"}
                    </span>
                  </div>
                </td>

                {/* =================================================
                    PRICE
                ================================================= */}

                <td className="px-6 py-5">
                  <span className="text-[13px] text-gray-600">
                    {startingPrice !== null
                      ? `From ${formatPrice(
                          startingPrice
                        )}`
                      : "—"}
                  </span>
                </td>

                {/* =================================================
                    STATUS
                ================================================= */}

                <td className="px-6 py-5">
                  <ProductStatusBadge
                    isActive={product.isActive}
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