import { useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

import type { AdminProduct } from "./types";
import { formatPrice, getStartingPrice } from "./productUtils";

// ─── Types ────────────────────────────────────────────────
interface ProductMobileListProps {
  products: AdminProduct[];
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (product: AdminProduct) => void;
  onToggleStatus: (product: AdminProduct) => void;
}

const ACTION_BUTTON_BASE =
  "flex h-10 w-full items-center justify-center rounded-lg border transition-all focus:outline-none";

// 👁️ VIEW — neutral
const VIEW_BUTTON_CLASS = `${ACTION_BUTTON_BASE} border-[#EFE3D2] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800`;

// ✏️ EDIT — BLUE (desktop ke saath match)
const EDIT_BUTTON_CLASS = `${ACTION_BUTTON_BASE} border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus-visible:ring-blue-300`;

// ⏻ TOGGLE — neutral bg + status icon color
const TOGGLE_BUTTON_CLASS = `${ACTION_BUTTON_BASE} border-[#EFE3D2] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300`;

// 🗑️ DELETE — red
const DELETE_BUTTON_CLASS = `${ACTION_BUTTON_BASE} border-red-100 bg-red-50/50 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-300`;

// ─── Component ────────────────────────────────────────────
function ProductMobileList({
  products,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}: ProductMobileListProps) {
  const navigate = useNavigate();

  return (
    <div className="divide-y divide-[#EFE3D2] md:hidden">
      {products.map((product) => {
        const variants = Array.isArray(product.variants)
          ? product.variants
          : [];

        const variantCount = variants.length;
        const startingPrice = getStartingPrice(variants);

        return (
          <article
            key={product.id}
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="cursor-pointer bg-white p-5 transition-colors hover:bg-[#fffbfc] sm:p-6"
          >
            {/* Product Information */}
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#FBECEF]">
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

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#3D3834]">
                      {product.name}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
                      {product.description}
                    </p>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px]",
                      product.isActive
                        ? "border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]"
                        : "border-[#E8E1D9] bg-[#F7F4F1] text-[#7B6D63]",
                    ].join(" ")}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Variants and Price */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#EFE3D2] bg-[#fffbfc] p-3.5">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Variants
                </p>
                <p className="mt-1 text-[14px] text-gray-700">
                  {variantCount}
                </p>
              </div>

              <div className="rounded-lg border border-[#EFE3D2] bg-[#fffbfc] p-3.5">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Starting Price
                </p>
                <p className="mt-1 text-[14px] text-gray-700">
                  {startingPrice !== null
                    ? formatPrice(startingPrice)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Product Actions */}
            <div
              className="mt-2 grid grid-cols-4 gap-2 pt-2"
              onClick={(event) => event.stopPropagation()}
            >
              {/* 👁️ VIEW */}
              <button
                type="button"
                onClick={() => navigate(`/admin/products/${product.id}`)}
                className={VIEW_BUTTON_CLASS}
                aria-label={`View ${product.name}`}
                title="View Product"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              {/* ✏️ EDIT — BLUE */}
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className={EDIT_BUTTON_CLASS}
                aria-label={`Edit ${product.name}`}
                title="Edit Product"
              >
                <FaEdit size={14} />
              </button>

              {/* ⏻ TOGGLE */}
              <button
                type="button"
                onClick={() => onToggleStatus(product)}
                className={TOGGLE_BUTTON_CLASS}
                aria-label={`${product.isActive ? "Deactivate" : "Activate"} ${product.name}`}
                title={product.isActive ? "Deactivate Product" : "Activate Product"}
              >
                <Power
                  size={14}
                  strokeWidth={1.9}
                  className={
                    product.isActive
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }
                />
              </button>

              {/* 🗑️ DELETE */}
              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className={DELETE_BUTTON_CLASS}
                aria-label={`Delete ${product.name}`}
                title="Delete Product"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </article>
        );
      })}

      {products.length === 0 && (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No products found.
        </div>
      )}
    </div>
  );
}

export default ProductMobileList;