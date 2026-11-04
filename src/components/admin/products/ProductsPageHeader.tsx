// src/components/admin/products/ProductsPageHeader.tsx

import { Plus } from "lucide-react";

interface ProductsPageHeaderProps {
  onAddProduct: () => void;
}

function ProductsPageHeader({
  onAddProduct,
}: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 sm:items-end sm:gap-4">
      
      {/* Heading Section */}
      <div className="min-w-0 flex-1">
        <h1 className="text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">
          Products
        </h1>

        <p className="mt-0.5 truncate text-[11px] font-[350] leading-relaxed text-slate-500 md:text-[12px] sm:mt-1 sm:truncate-none">
          Manage your products and their basic information.
        </p>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={onAddProduct}
        className="
          inline-flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 
          rounded-xl bg-[#B5697A] px-3.5 py-2 text-[11px] sm:px-5 sm:py-2.5 sm:text-[12px]
          text-white shadow-sm
          hover:bg-[#A55F70] hover:shadow-md 
          focus:outline-none 
        "
      >
        <Plus size={14} className="sm:h-4 sm:w-4" aria-hidden="true" />
        Add
        <span className="hidden sm:inline">Product</span>
      </button>
    </div>
  );
}

export default ProductsPageHeader;