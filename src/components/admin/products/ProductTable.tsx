import { useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

import type { AdminProduct } from "./types";
import { formatPrice, getStartingPrice } from "./productUtils";
import ProductStatusBadge from "./ProductStatusBadge";

// ─── Types ────────────────────────────────────────────────
interface ProductTableProps {
  products: AdminProduct[];
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (product: AdminProduct) => void;
  onToggleStatus: (product: AdminProduct) => void;
}

// ─── Config ───────────────────────────────────────────────
const TABLE_HEADERS = [
  "Product",
  "Variants",
  "Starting Price",
  "Status",
  "Actions",
];

const TH_CLASS =
  "px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white";

const ACTION_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#EFE3D2] bg-white text-slate-600 transition-colors hover:bg-[#FBECEF] hover:text-[#B5697A] focus:outline-none";

// ✅ Blue styling for Edit button
const EDIT_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 focus:outline-none";

// ─── Component ───────────────────────────────────────────
function ProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}: ProductTableProps) {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            {TABLE_HEADERS.map((header) => (
              <th key={header} className={TH_CLASS}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            // Safely handle products without variants.
            const variants = Array.isArray(product.variants)
              ? product.variants
              : [];

            const variantCount = variants.length;
            const startingPrice = getStartingPrice(variants);

            return (
              <tr
                key={product.id}
                onClick={() => navigate(`/admin/products/${product.id}`)}
                className="cursor-pointer border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#fffbfc]"
              >
                {/* Product */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FBECEF]">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#B5697A]">
                          <span className="text-lg font-medium">—</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-gray-600">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Variants */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-gray-600">
                      {variantCount}
                    </span>

                    <span className="text-[12px] text-gray-500">
                      {variantCount === 1 ? "variant" : "variants"}
                    </span>
                  </div>
                </td>

                {/* Starting Price */}
                <td className="px-6 py-5">
                  <span className="text-[13px] text-gray-600">
                    {startingPrice !== null
                      ? `From ${formatPrice(startingPrice)}`
                      : "—"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <ProductStatusBadge isActive={product.isActive} />
                </td>

                {/* Actions */}
                <td
                  className="px-6 py-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    {/* ✅ Edit Button - Blue */}
                    <button
                      type="button"
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEditProduct(product)}
                      className={EDIT_BUTTON_CLASS}
                    >
                      <FaEdit size={15} />
                    </button>

                    {/* Toggle Status Button */}
                    <button
                      type="button"
                      title={
                        product.isActive
                          ? "Deactivate product"
                          : "Activate product"
                      }
                      aria-label={`${
                        product.isActive ? "Deactivate" : "Activate"
                      } ${product.name}`}
                      onClick={() => onToggleStatus(product)}
                      className={ACTION_BUTTON_CLASS}
                    >
                      <Power
                        size={15}
                        className={
                          product.isActive
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }
                      />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDeleteProduct(product)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-white text-red-500 transition-colors hover:bg-red-50 focus:outline-none"
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={TABLE_HEADERS.length}
                className="px-6 py-12 text-center text-sm text-slate-500"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;