// src/components/admin/products/ProductsPageHeader.tsx

interface ProductsPageHeaderProps {
  onAddProduct: () => void;
}

function ProductsPageHeader({
}: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>

        <h1 className="mt-2 text-[18px] md:text-[24px] font-bold tracking-tight text-slate-900">
          Products
        </h1>

        <p className="mt-0 max-w-xl text-sm leading-6 text-slate-500">
          Manage your products and their basic
          information.
        </p>
      </div>

      {/* <button
        type="button"
        onClick={onAddProduct}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8b542f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
      >
        <span
          className="text-base leading-none"
          aria-hidden="true"
        >
          +
        </span>

        Add Product
      </button> */}
    </div>
  );
}

export default ProductsPageHeader;